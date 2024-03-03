import { Request, Response } from "express";
import { Client } from "@notionhq/client";

export const createNotionPage = async (req: Request, res: Response) => {
  const access_token = req.body.access_token;
  console.log(access_token);
  const notion = new Client({
    auth: access_token,
  });

  const parentPageId = req.body.page_id;
  const pageTitle = req.body.title;
  const response = await notion.pages.create({
    // cover: {
    //   type: "external",
    //   external: {
    //     url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg",
    //   },
    // },
    parent: {
      type: "page_id",
      page_id: parentPageId,
    },
    properties: {
      title: {
        title: [
          {
            text: {
              content: pageTitle,
            },
          },
        ],
      },
    },
  });

  console.log(response.id);

  res.status(200).json({
    message: "Page created successfully",
    data: response.id,
  });
};
