import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Paystack sends the event data in the request body
    const event = req.body;

    // Handle the event
    switch (event.event) {
      case "charge.success":
        // Handle successful charge
        break;
      // Add more case blocks to handle other events
      default:
        // Return a response to acknowledge receipt of the event
        res.json({ received: true });
    }
  } else {
    // Return a method not allowed error if the request is not a POST request
    res.status(405).json({ error: "Method not allowed" });
  }
}
