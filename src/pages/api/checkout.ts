import type { NextApiRequest, NextApiResponse } from "next";
import Paystack from "paystack";

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY!);

type Data = {
  message: string;
  url?: string;
};

export default async function CheckoutHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const name = req.body.name || "Anonymous";
  const message = req.body.message || "";
  const quantity = req.body.quantity || 1;
  const amountInKobo = Math.round(parseFloat(req.body.amount) * 100);
  const email = req.body.email;
  const reference = req.body.reference;

  if (!quantity) {
    res.status(400).json({ message: "Quantity is required" });
    return;
  }

  try {
    // const amount = 1000; // Replace with the actual amount of the product
    const session = await paystack.transaction.initialize({
      name: "Donation",
      amount: amountInKobo,
      email: email,
      reference: reference,
      metadata: {
        recordId: req.body.recordId,
        name,
        message,
      },
      quantity: quantity,
      callback_url: "redirect URL",
      channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
      // success-url:
      // cancel-url:
    });
    const url = session.url;
    if (url) {
      return res.status(200).send({
        url,
        message: "",
      });
    }

    console.log(session);
    return res.status(200).json({
      message: "Transaction initialized successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while initializing transaction" + e,
    });
  }
}
