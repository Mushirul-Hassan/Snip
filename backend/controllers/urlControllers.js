import express from "express";
import { Url } from "../models/urlModel.js";
import { nanoid } from "nanoid";

export const createUrl = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUrl = async (req, res) => {
  try {
    const { nano_id } = req.params;

    const getUrl = await Url.findOne({ nano_id }, { _id: 0, url: 1 });

    // console.log(getUrl.url);
    res.redirect(getUrl.url);
    const clickCount = await Url.findOneAndUpdate(
      { nano_id: nano_id },
      { $inc: { click: 1 } },
    );
    // console.log(clickCount.click);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUrl = async (req, res) => {
  try {
    const { nano_id } = req.params;
    const editUrl = req.body.url;
    const updatedUrl = await Url.findOneAndUpdate(
      { nano_id },
      { $set: { url: editUrl } },
      { returnDocument: "after" },
    );

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
