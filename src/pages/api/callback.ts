import type { NextApiRequest, NextApiResponse } from "next";
import Paystack from "paystack";

const paystack = Paystack("SECRET_KEY");

type Data = {
  message: string;
};

export default async function CallbackHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const event = req.body.event;
  const reference = req.body.data.reference;

  try {
    const transaction = await paystack.transaction.verify(reference);
    console.log(transaction);

    // Update the status of the transaction in your database
    // ...

    res.status(200).json({ message: "Transaction verified successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while verifying transaction",
    });
  }
}
