"use strict";
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
exports.PaymentServices = void 0;
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("../order/order_model");
const transaction_model_1 = require("../transaction/transaction_model");
const product_model_1 = require("../product/product_model");
// ---------------------------------------------------------
// ---------------For SSL Commerz Payment-------------------
// ---------------------------------------------------------
//  store credentials
const store_id = config_1.default.sslCommerz_store_id;
const store_passwd = config_1.default.sslCommerz_store_password;
const is_live = false;
// ---------------------------------------------------------
// success payment
// ---------------------------------------------------------
const successPayment = (cookieToken, sslPayload) => __awaiter(void 0, void 0, void 0, function* () {
    if (sslPayload.status !== "VALID") {
        throw new AppError_1.default(400, "Payment not valid");
    }
    let redirectUrl = "";
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    const sslValidateResponseData = yield sslcz.validate({
        val_id: sslPayload.val_id,
    });
    if (sslValidateResponseData.status !== "VALID")
        throw new AppError_1.default(400, "Payment not valid");
    const session = yield mongoose_1.default.startSession();
    try {
        const order = yield order_model_1.Order.findOne({
            transactionId: sslValidateResponseData.tran_id,
        })
            .session(session)
            .orFail(new AppError_1.default(404, "Order not found"));
        order.payment = "Paid";
        order.due = 0;
        order.paid = Number(sslValidateResponseData.amount);
        order.transactionId = sslValidateResponseData.tran_id;
        order.status = "success";
        yield order.save({ session });
        yield transaction_model_1.Transaction.findOneAndUpdate({ tran_id: sslValidateResponseData.tran_id }, {
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
            card_issuer_country_code: sslValidateResponseData.card_issuer_country_code,
            card_brand: sslValidateResponseData.card_brand,
            verify_key: sslValidateResponseData.verify_key,
            verify_sign: sslValidateResponseData.verify_sign,
            verify_sign_sha2: sslValidateResponseData.verify_sign_sha2,
            risk_title: sslValidateResponseData.risk_title,
            risk_level: sslValidateResponseData.risk_level,
        }, { new: true, session }).orFail(new AppError_1.default(404, "Transaction history not found"));
        redirectUrl = `${config_1.default.payment_success_client_url}?paid-amount=${sslValidateResponseData.amount}&TxID=${sslValidateResponseData.tran_id}`;
    }
    catch (err) {
        yield session.abortTransaction();
        throw new AppError_1.default(400, "Payment not valid");
    }
    finally {
        yield session.endSession();
    }
    return redirectUrl;
});
// ---------------------------------------------------------
// failed payment
// ---------------------------------------------------------
const failedPayment = (cookieToken, sslPayload) => __awaiter(void 0, void 0, void 0, function* () {
    if (sslPayload.status === "FAILED") {
        const session = yield mongoose_1.default.startSession();
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_model_1.Order.findOne({ transactionId: sslPayload.tran_id })
                .select("products transaction")
                .session(session)
                .orFail(new AppError_1.default(404, "Order not found"));
            const ops = order.products.map((p) => ({
                updateOne: {
                    filter: { _id: p.productId },
                    update: { $inc: { stock: p.quantity } },
                },
            }));
            yield product_model_1.Product.bulkWrite(ops, { session });
            yield transaction_model_1.Transaction.findByIdAndDelete(order.transaction, { session });
            yield order.deleteOne({ session });
        }));
        const redirectUrl = `${config_1.default.payment_fail_client_url}?refundAmount=${sslPayload.amount}`;
        return redirectUrl;
    }
});
const canceledPayment = (cookieToken, sslPayload) => __awaiter(void 0, void 0, void 0, function* () {
    if (sslPayload.status === "CANCELLED") {
        const session = yield mongoose_1.default.startSession();
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_model_1.Order.findOne({ transactionId: sslPayload.tran_id })
                .select("products transaction")
                .session(session)
                .orFail(new AppError_1.default(404, "Order not found"));
            const ops = order.products.map((p) => ({
                updateOne: {
                    filter: { _id: p.productId },
                    update: { $inc: { stock: p.quantity } },
                },
            }));
            yield product_model_1.Product.bulkWrite(ops, { session });
            yield transaction_model_1.Transaction.findByIdAndDelete(order.transaction, { session });
            yield order.deleteOne({ session });
        }));
        const redirectUrl = `${config_1.default.payment_cancel_client_url}?refundAmount=${sslPayload.amount}`;
        return redirectUrl;
    }
});
exports.PaymentServices = {
    successPayment,
    failedPayment,
    canceledPayment,
};
