import express from "express";
import payment from "../controllers/payments.js";

const router = express.Router();

// 1️⃣ Create a Payment Intent (before confirming payment)
router.post("/create", payment.createPayment);

// 2️⃣ Confirm the Payment (charge the user)
router.post("/confirm/:paymentId", payment.confirmPayment);

// 3️⃣ Refund a Payment (admin or customer request)
router.post("/refund/:paymentId", payment.refundPayment);

// 4️⃣ Check Payment Status
router.get("/status/:paymentId", payment.getPaymentStatus);

export default router;
