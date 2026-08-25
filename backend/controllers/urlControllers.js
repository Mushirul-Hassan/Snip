import express from "express";
import { Url } from "../models/urlModel.js";
import { nanoid } from "nanoid";

export const createUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res
        .status(404)
        .json({ success: false, message: "URL is required" });
    }

    const snip = nanoid();

    const newUrl = new Url({
      url,
      nano_id: snip,
    });

    const savedUrl = await newUrl.save();
    // add validation for correct structure
    res.status(201).json({
      success: true,
      message: "URL shortened successfully!",
      data: savedUrl,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUrls = async (req, res) => {
  try {
    const page  = req.query.page || 1;
    console.log(page);
    const limit = req.query.limit || 10;
    console.log(limit);
    const getUrls = await Url.find({})
    .limit(limit * 1)
    .skip((page - 1) * limit);
    res.status(200).json({
      success: true,
      message: "Sending all URLs",
      data: getUrls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUrl = async (req, res) => {
  try {
    const { nano_id } = req.params;
    //  if (!nano_id) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Url is not present" });
    // }
    // add validation for correct structure
    const getUrl = await Url.findOne({ nano_id }, { _id: 0, url: 1 });
    if (!getUrl) {
      return res
        .status(404)
        .json({ success: false, message: "Url is not present" });
    }
    // console.log(getUrl.url);
    res.redirect(getUrl.url);
    const clickCount = await Url.findOneAndUpdate(
      { nano_id: nano_id },
      { $inc: { click: 1 } },
    );
    // console.log(clickCount.click);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateUrl = async (req, res) => {
  try {
    const { nano_id } = req.params;
    //    if (!nano_id) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Please provide nano_id" });
    // }
    const editUrl = req.body.url;
    if (!editUrl) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide new url" });
    }
    const updatedUrl = await Url.findOneAndUpdate(
      { nano_id },
      { $set: { url: editUrl } },
      { returnDocument: "after" },
    );
    // add validation for correct structure
    res.status(200).json({
      success: true,
      message: "URL changed successfully!",
      data: updatedUrl,
    });
    // console.log("this is the updated url", updatedUrl.url);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const { nano_id } = req.params;
    // console.log(id);
    const remove = await Url.findOneAndDelete({ nano_id });
    console.log(remove);

    res.status(200).json({
      success: true,
      message: "URL deleted successfully!",
      data: remove,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
