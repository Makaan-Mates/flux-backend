import { Request, Response } from "express";
import { Client } from "@notionhq/client";

export const fetchNotionPages = async (req: Request, res: Response) => {
  const access_token = req.body.access_token;
  console.log(access_token);
  const notion = new Client({
    auth: access_token,
  });

  try {
    const response = await notion.search({
      filter: { property: "object", value: "page" },
      page_size: 100,
    });
    const filteredResponse = response.results.filter(
      //@ts-ignore

      (page) => page.parent.type === "workspace",
    );

    res.status(200).json({
      message: "Notion pages fetched successfully",
      data: filteredResponse,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to fetch Notion pages",
      //@ts-ignore

      error: err.message,
    });
  }
};
