import express, { json, urlencoded } from "express";

export const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
