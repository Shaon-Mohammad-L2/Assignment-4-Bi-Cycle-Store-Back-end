"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const client_model_1 = require("../client/client_model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const mongoose_1 = __importStar(require("mongoose"));
const product_model_1 = require("../product/product_model");
const order_model_1 = require("./order_model");
const auth_utils_1 = require("../auth/auth_utils");
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const config_1 = __importDefault(require("../../config"));
const transaction_model_1 = require("../transaction/transaction_model");
//  store credentials
const store_id = config_1.default.sslCommerz_store_id;
const store_passwd = config_1.default.sslCommerz_store_password;
const is_live = false;
// create order into db.
const createOrderIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { client } = yield client_model_1.Client.isUserAndClientInformationFindBy_id(user.user_id);
    if (!client) {
        throw new AppError_1.default(404, "This user is not found");
    }
    const productIds = payload.products.map((id) => new mongoose_1.Types.ObjectId(id.productId));
    const isProductExist = yield product_model_1.Product.find({
        _id: { $in: productIds },
    }).select("stock price costing currency name images");
    if (isProductExist.length !== productIds.length) {
        throw new AppError_1.default(400, "One or more products are not found!");
    }
    let totalQuantity = 0;
    let totalAmount = 0;
    for (const product of isProductExist) {
        const orderProduct = payload.products.find((item) => item.productId.toString() === product._id.toString());
        if (product.stock <= 0) {
            throw new AppError_1.default(400, `${product.name} is not available in stock!`);
        }
        if (orderProduct && product.stock < orderProduct.quantity) {
            throw new AppError_1.default(400, `${product.name} is not enough in stock!`);
        }
        totalAmount += Number(product.price) * Number(orderProduct === null || orderProduct === void 0 ? void 0 : orderProduct.quantity);
        totalQuantity += Number(orderProduct === null || orderProduct === void 0 ? void 0 : orderProduct.quantity);
    }
    const orderID = (0, auth_utils_1.generateOTP)();
    payload.totalAmount = totalAmount;
    payload.totalQuantity = totalQuantity;
    payload.user = client._id;
    payload.email = (_a = payload.email) !== null && _a !== void 0 ? _a : client.email;
    payload.name = (_b = payload.name) !== null && _b !== void 0 ? _b : client.name;
    payload.phone = (_c = payload.phone) !== null && _c !== void 0 ? _c : client.phone;
    payload.location = (_d = payload.location) !== null && _d !== void 0 ? _d : client.location;
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
            success_url: config_1.default.sslCommerz_payment_success_url,
            fail_url: config_1.default.sslCommerz_payment_fail_url,
            cancel_url: config_1.default.sslCommerz_payment_cancel_url,
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
        const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
        try {
            const sslResponse = yield sslcz.init(sslData);
            if (sslResponse === null || sslResponse === void 0 ? void 0 : sslResponse.GatewayPageURL) {
                payload.status = "pending";
                payload.isFullPay = true;
                payload.transactionId = sslData.tran_id;
                const session1 = yield mongoose_1.default.startSession();
                try {
                    session1.startTransaction();
                    const [order] = yield order_model_1.Order.create([payload], { session: session1 });
                    // update product stock.
                    for (const product of payload.products) {
                        yield product_model_1.Product.findByIdAndUpdate(product.productId, {
                            $inc: { stock: -product.quantity },
                        }, { session: session1 });
                    }
                    const transactionData = {
                        payment: payload.payment,
                        order: order._id,
                        tran_id: sslData.tran_id,
                        total_amount: totalAmount,
                        total_quantity: totalQuantity,
                        currency: payload.currency,
                        cus_name: payload.name,
                        cus_email: payload.email,
                        cus_phone: payload.phone,
                        cus_add1: payload.location,
                        cus_city: sslData.cus_city,
                        cus_country: sslData.cus_country,
                        shipping_method: sslData.shipping_method,
                        product_category: sslData.product_category,
                        product_profile: "general",
                        status: payload.status,
                        deliveryStatus: "pending",
                        isDeleted: false,
                    };
                    const [transaction] = yield transaction_model_1.Transaction.create([transactionData], {
                        session: session1,
                    });
                    yield order.updateOne({ transaction: transaction._id }, { session: session1 });
                    yield session1.commitTransaction();
                }
                catch (err) {
                    yield session1.abortTransaction();
                    throw new AppError_1.default(500, "Order creation failed! Please try again.");
                }
                finally {
                    yield session1.endSession();
                }
                return {
                    paymentUrl: sslResponse.GatewayPageURL,
                    message: "Redirect user to this URL to complete payment",
                };
            }
        }
        catch (err) {
            throw new AppError_1.default(500, "Payment gateway error! Please try again.");
        }
    }
    else {
        payload.status = "success";
        payload.isFullPay = false;
        const session2 = yield mongoose_1.default.startSession();
        try {
            session2.startTransaction();
            const result = yield order_model_1.Order.create([payload], { session: session2 });
            const order = result[0].populate({
                path: "products.productId",
                select: "name images price",
            });
            for (const product of payload.products) {
                yield product_model_1.Product.findByIdAndUpdate(product.productId, {
                    $inc: { stock: -product.quantity },
                }, { session: session2 });
            }
            yield session2.commitTransaction();
            return order;
        }
        catch (err) {
            yield session2.abortTransaction();
            throw new AppError_1.default(500, "Order creation failed! Please try again.");
        }
        finally {
            yield session2.endSession();
        }
    }
});
exports.OrderServices = { createOrderIntoDB };
