import SSLCommerzPayment from "sslcommerz-lts";
import { TSslPayload } from "./payment_interface";
import config from "../../config";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { Order } from "../order/order_model";
import { Transaction } from "../transaction/transaction_model";

// ---------------------------------------------------------
// ---------------For SSL Commerz Payment-------------------
// ---------------------------------------------------------
//  store credentials
const store_id = config.sslCommerz_store_id as string;
const store_passwd = config.sslCommerz_store_password as string;
const is_live = false;
const successPayment = async (cookieToken: string, sslPayload: TSslPayload) => {
  if (sslPayload.status !== "VALID") {
    throw new AppError(400, "Payment not valid");
  }
  let redirectUrl = "";
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const sslValidateResponseData = await sslcz.validate({
    val_id: sslPayload.val_id,
  });

  if (sslValidateResponseData.status !== "VALID")
    throw new AppError(400, "Payment not valid");

  const session = await mongoose.startSession();
  try {
    const order = await Order.findOne({
      transactionId: sslValidateResponseData.tran_id,
    })
      .session(session)
      .orFail(new AppError(404, "Order not found"));

    order.payment = "Paid";
    order.due = 0;
    order.paid = Number(sslValidateResponseData.amount);
    order.transactionId = sslValidateResponseData.tran_id;
    order.status = "success";

    await order.save({ session });

    await Transaction.findOneAndUpdate(
      { tran_id: sslValidateResponseData.tran_id },
      {
        payment: order.payment,
        status: order.status,
        total_amount: Number(sslValidateResponseData.amount),
        total_quantity: order.totalQuantity,
        currency_amount: sslValidateResponseData.currency_amount,
        currency_rate: sslValidateResponseData.currency_rate,
        card_type: sslValidateResponseData.card_type,
        card_no: sslValidateResponseData.card_no,
        bank_tran_id: sslValidateResponseData.bank_tran_id,
        store_amount: sslValidateResponseData.store_amount,
        card_issuer: sslValidateResponseData.card_issuer,
        card_issuer_country: sslValidateResponseData.card_issuer_country,
        card_issuer_country_code:
          sslValidateResponseData.card_issuer_country_code,
        card_brand: sslValidateResponseData.card_brand,
        verify_key: sslValidateResponseData.verify_key,
        verify_sign: sslValidateResponseData.verify_sign,
        verify_sign_sha2: sslValidateResponseData.verify_sign_sha2,
        risk_title: sslValidateResponseData.risk_title,
        risk_level: sslValidateResponseData.risk_level,
      },
      { new: true, session }
    ).orFail(new AppError(404, "Transaction history not found"));

    redirectUrl = `${config.payment_success_client_url}?paid-amount=${sslValidateResponseData.amount}&TxID=${sslValidateResponseData.tran_id}`;
  } catch (err) {
    await session.abortTransaction();
    throw new AppError(400, "Payment not valid");
  } finally {
    await session.endSession();
  }
  return redirectUrl;
};

export const PaymentServices = { successPayment };
