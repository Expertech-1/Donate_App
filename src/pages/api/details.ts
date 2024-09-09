import type { NextApiRequest, NextApiResponse } from "next";
import Paystack from "paystack";
import axios from "axios";

const paystack = Paystack("SECRET_KEY");

type Data = {
  message: string;
};

export default async function DetailsHandler(
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

    const airtableApiKey = "AIRTABLE_API_KEY";
    const airtableBaseId = "AIRTABLE_BASE_ID";
    const airtableTable = "AIRTABLE_TABLE_NAME";

    const airtableUrl =
      `https://api.airtable.com/v0/${airtableBaseId}/${airtableTable}/${transaction.metadata.recordId}`;
    const airtableHeaders = {
      Authorization: `Bearer ${airtableApiKey}`,
      "Content-Type": "application/json",
    };

    const airtableResponse = await axios.get(airtableUrl, {
      headers: airtableHeaders,
    });
    const airtableRecord = airtableResponse.data;

    console.log(airtableRecord);

    res.status(200).json({ message: "Transaction verified successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while verifying transaction",
    });
  }
}
