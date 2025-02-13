import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class Payments {


/*Note about the endpoint 
Does not redirect users to Stripe's site. Instead, it uses Stripe Payment Intents and requires 
you to integrate Stripe.js and Stripe Elements on the frontend to collect payment details.
*/

// 1️⃣ Create a Payment Intent
 static async createPayment (req, res){
    try {
        const { userId, bookingId, amount, currency, paymentMethod } = req.body;
    
        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          payment_method_types: ["card"],
        });
    
        console.log(paymentIntent)

        
        // Store payment in MongoDB
        const newPayment = new Payment({
          userId,
          bookingId,
          paymentId: paymentIntent.id,
          amount,
          currency,
          status: "pending",
          paymentMethod
        });
    
        await newPayment.save();
    
        res.json({ clientSecret: paymentIntent.client_secret, paymentId: paymentIntent.id });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};

// 2️⃣ Confirm Payment
static  confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { paymentMethod } = req.body; // Get the payment method from the request body

        // Update the PaymentIntent with the payment method
        await stripe.paymentIntents.update(paymentId, {
            payment_method: paymentMethod,
        });
    
    const paymentIntent = await stripe.paymentIntents.confirm(paymentId);

    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentId: paymentId },
      { status: paymentIntent.status },
      { new: true } // Return the updated document
    );

    
    res.json({ status: paymentIntent.status,updatedPayment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3️⃣ Refund Payment
static refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
    });

    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentId },
      { status: "refunded" },
      { new: true }
    );
    

    res.json({ status: refund.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4️⃣ Get Payment Status
static getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    
    res.json({ status: paymentIntent.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

}

export default Payments


/*

NOTE : It redirectS users to Stripe's site. so the user will  complete the payment.

import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/Booking.js"; // Assuming you have a Booking model for storing booking details

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class Payment {
  // 1️⃣ Create a Checkout Session
  static async createCheckoutSession(req, res) {
    try {
      const { userId, bookingId, amount, currency, items } = req.body;

      // Create a Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => ({
          price_data: {
            currency: currency,
            product_data: {
              name: item.name,
              description: item.description || "Movie Ticket",
            },
            unit_amount: item.amount * 100, // Amount in cents
          },
          quantity: item.quantity || 1,
        })),
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/success?bookingId=${bookingId}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });

      // Store booking details in MongoDB (optional)
      const newBooking = new Booking({
        userId,
        bookingId,
        amount,
        currency,
        status: "pending",
      });

      await newBooking.save();

      // Return the session URL to the frontend
      res.json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 2️⃣ Get Payment Status (Optional)
  static async getPaymentStatus(req, res) {
    try {
      const { sessionId } = req.params;

      // Retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Update the booking status in MongoDB based on the session status
      if (session.payment_status === "paid") {
        await Booking.updateOne(
          { bookingId: session.metadata.bookingId },
          { status: "completed" }
        );
      }

      res.json({ status: session.payment_status });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default Payment;



*/