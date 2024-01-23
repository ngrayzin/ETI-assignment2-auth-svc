import express from "express";
import POST from "./POST"

const app = express();
app.use(POST);
export default app;