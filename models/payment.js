import {Schema,model} from "mongoose";

const PaymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    paymentId: { type: String, required: true, unique: true }, // Stripe Payment Intent ID
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: { type: String, enum: ["pending", "succeeded", "failed", "refunded"], default: "pending" },
    paymentMethod: { type: String,enum:["pm_card_visa","pm_card_mastercard","pm_card_amex","pm_bank_debit","pm_local_idéal","pm_card_discover"] }, // "card", "paypal", etc.
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Payment = model("Payments", PaymentSchema);
export default Payment;
