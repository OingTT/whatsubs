import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const translatePapago = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { text } = req.query;

    const response = await axios.post(
      "https://openapi.naver.com/v1/papago/n2mt",
      {
        source: "en",
        target: "ko",
        text: text,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
        },
      }
    );

    const translatedText =
      response.data?.message?.result?.translatedText || "";

    res.status(200).json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
};

export default translatePapago;
