import { JwtPayload } from "jsonwebtoken";
import { TOrder } from "./order_interface";
import { Client } from "../client/client_model";
import AppError from "../../errors/AppError";
import mongoose, { Types } from "mongoose";
import { Product } from "../product/product_model";
import { Order } from "./order_model";
import { generateOTP } from "../auth/auth_utils";
import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../config";
import { TTransaction } from "../transaction/transaction_interface";
import { Transaction } from "../transaction/transaction_model";

//  store credentials
const store_id = config.sslCommerz_store_id as string;
const store_passwd = config.sslCommerz_store_password as string;
const is_live = false;

// create order into db.
const createOrderIntoDB = async (user: JwtPayload, payload: TOrder) => {
  const { client } = await Client.isUserAndClientInformationFindBy_id(
    user.user_id
  );

  if (!client) {
    throw new AppError(404, "This user is not found");
  }

  const productIds = payload.products.map(
    (id) => new Types.ObjectId(id.productId)
  );

  const isProductExist = await Product.find({
    _id: { $in: productIds },
  }).select("stock price costing currency name images");

  if (isProductExist.length !== productIds.length) {
    throw new AppError(400, "One or more products are not found!");
  }

  let totalQuantity = 0;
  let totalAmount = 0;

  for (const product of isProductExist) {
    const orderProduct = payload.products.find(
      (item) => item.productId.toString() === product._id.toString()
    );

    if (product.stock <= 0) {
      throw new AppError(400, `${product.name} is not available in stock!`);
    }

    if (orderProduct && product.stock < orderProduct.quantity) {
      throw new AppError(400, `${product.name} is not enough in stock!`);
    }

    totalAmount += Number(product.price) * Number(orderProduct?.quantity!);
    totalQuantity += Number(orderProduct?.quantity!);
  }

  const orderID = generateOTP();
  payload.totalAmount = totalAmount;
  payload.totalQuantity = totalQuantity;
  payload.user = client._id!;
  payload.email = payload.email ?? client.email;
  payload.name = payload.name ?? client.name;
  payload.phone = payload.phone ?? client.phone;
  payload.location = payload.location ?? client.location;
  payload.deliveryStatus = "pending";
  payload.currency = "BDT";
  payload.isDeleted = false;
  payload.orderID = orderID;
  payload.paid = 0;
  payload.due = totalAmount;
  payload.payment = "Unpaid";

  if (payload.isFullPay) {
    // redirect to payment gateway. ssl commerce.
    const sslData = {
      total_amount: totalAmount,
      currency: payload.currency,
      tran_id: `TXID-${orderID}`,
      success_url: config.sslCommerz_payment_success_url,
      fail_url: config.sslCommerz_payment_fail_url,
      cancel_url: config.sslCommerz_payment_cancel_url,
      cus_name: payload.name,
      cus_email: payload.email,
      cus_phone: payload.phone,
      cus_add1: payload.location,
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      product_name: productIds.join(", "),
      product_category: "BiCycle",
      product_profile: "general",
    };
    // Initialize SSLCommerz
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    try {
      const sslResponse = await sslcz.init(sslData);
      if (sslResponse?.GatewayPageURL) {
        payload.status = "pending";
        payload.isFullPay = true;
        payload.transactionId = sslData.tran_id;

        const session1 = await mongoose.startSession();
        try {
          session1.startTransaction();
          const [order] = await Order.create([payload], { session: session1 });

          // update product stock.
          for (const product of payload.products) {
            await Product.findByIdAndUpdate(
              product.productId,
              {
                $inc: { stock: -product.quantity },
              },
              { session: session1 }
            );
          }

          const transactionData: Partial<TTransaction> = {
            payment: payload.payment,
            order: order._id,
            tran_id: sslData.tran_id,
            total_amount: totalAmount,
            total_quantity: totalQuantity,
            currency: payload.currency,
            cus_name: payload.name,
            cus_email: payload.email,
            cus_phone: payload.phone,
            cus_add1: payload.location!,
            cus_city: sslData.cus_city,
            cus_country: sslData.cus_country,
            shipping_method: sslData.shipping_method,
            product_category: sslData.product_category,
            product_profile: "general",
            status: payload.status,
            deliveryStatus: "pending",
            isDeleted: false,
          };

          const [transaction] = await Transaction.create([transactionData], {
            session: session1,
          });
          await order.updateOne(
            { transaction: transaction._id },
            { session: session1 }
          );

          await session1.commitTransaction();
        } catch (err) {
          await session1.abortTransaction();
          throw new AppError(500, "Order creation failed! Please try again.");
        } finally {
          await session1.endSession();
        }

        return {
          paymentUrl: sslResponse.GatewayPageURL,
          message: "Redirect user to this URL to complete payment",
        };
      }
    } catch (err) {
      throw new AppError(500, "Payment gateway error! Please try again.");
    }
  } else {
    payload.status = "success";
    payload.isFullPay = false;
    const session2 = await mongoose.startSession();
    try {
      session2.startTransaction();
      const result = await Order.create([payload], { session: session2 });

      const order = result[0].populate({
        path: "products.productId",
        select: "name images price",
      });
      for (const product of payload.products) {
        await Product.findByIdAndUpdate(
          product.productId,
          {
            $inc: { stock: -product.quantity },
          },
          { session: session2 }
        );
      }
      await session2.commitTransaction();
      return order;
    } catch (err) {
      await session2.abortTransaction();
      throw new AppError(500, "Order creation failed! Please try again.");
    } finally {
      await session2.endSession();
    }
  }
};

export const OrderServices = { createOrderIntoDB };
