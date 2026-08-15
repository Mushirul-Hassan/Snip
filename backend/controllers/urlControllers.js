import express from "express";
import { Url } from "../models/urlModel.js";
import { nanoid } from "nanoid";

export const createUrl = async (req, res) => {
  const { url } = req.body;
  const snip = nanoid();

  const newUrl = new Url({
    url,
    nano_id: snip,
  });

  const savedUrl = await newUrl.save();

  res.status(201).json({
    success: true,
    message: "URL shortened successfully!",
    data: savedUrl,
  });
};

export const getUrl = async (req, res) => {
  const { nano_id } = req.params;
  const getUrl = await Url.findOne({ nano_id: nano_id }, { _id: 0, url: 1 });

  res.redirect(301, getUrl.url);
  const clickCount = await Url.findOneAndUpdate(
    { nano_id: nano_id },
    { $inc: { click: 1 } },
  );

  console.log(clickCount.click);
};

export const updateUrl = async (req, res) => {
  // const { _id } = req.params.id;
  const updateUrl = await Url.findByIdAndUpdate(
    { _id },
    { $set: { url: req.body.url } },
    {new: true},
  );

  res.status(201).json({
    success: true,
    message: "URL changed successfully!",
    data: updateUrl,
  });
};
