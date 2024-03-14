import { Request, Response } from "express";
import { Client } from "@notionhq/client";

export const appendContent = async (req: Request, res: Response) => {
  const access_token = req.body.access_token;
  console.log(access_token);
  const notion = new Client({
    auth: access_token,
  });

  const pageId = req.body.page_id;
  const contentBlocks = req.body.content;
  // console.log("pageId: " + pageId);
  // const content = req.body.content;
  // const contentBlocks = [
  //   {
  //     object: "block",
  //     type: "paragraph",
  //     paragraph: {
  //       rich_text: [
  //         {
  //           type: "text",
  //           text: {
  //             content: content,
  //           },
  //         },
  //       ],
  //     },
  //   },
  // ];

  try {
    const response = await notion.blocks.children.append({
      block_id: pageId,
      //@ts-ignore

      children: contentBlocks,
    });

    res.status(200).json({
      message: "Content added successfully",
      data: response,
    });
  } catch (error) {
    console.error("Failed to add content to page:", error);
    res.status(500).json({
      message: "Failed to add content to page",
      //@ts-ignore

      error: error.message,
    });
  }
};
