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
  const id = req.params.id;
  const getUrl = await Url.findById(id);

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: getUrl,
  });
};
