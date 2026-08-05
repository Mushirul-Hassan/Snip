import express from "express";
import { Url } from "../models/urlModel";

export const createUrl = (req, res) => {
  const { url } = req.body;

  res.send("here i will create a shoert url");
};

export const getUrl = (req, res) => {
  res.send("here i will get the  url");
};
