import express from "express";
import { Url } from "../models/urlModel";
import { nanoid } from "nanoid";

export const createUrl = (req, res) => {
  const { url } = req.body;
  const  snip = nanoid();
  const newUrl = new Url({
    url,
    nano_id: snip
  });


  
  

  res.send("here i will create a shoert url");
};

export const getUrl = (req, res) => {
  res.send("here i will get the  url");
};
