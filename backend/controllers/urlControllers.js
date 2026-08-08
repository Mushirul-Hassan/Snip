import express from "express";
import { Url } from "../models/urlModel";
// import { nanoid } from "nanoid";

export const createUrl = async (req, res) => {
  const { url } = req.body;
  const snip = nanoid();

  const newUrl = new Url({
    url,
    nano_id: snip,
  });

  await newUrl.save();

  res
    .status(201)
    .json({
      success: true,
      message: "URL shortened successfully!",
      newUrl: newUrl
    });
};

export const getUrl = async (req, res) => {
  // const getUrl = await findOne(Url(_id));

  res.send("here i will get the  url");
};
