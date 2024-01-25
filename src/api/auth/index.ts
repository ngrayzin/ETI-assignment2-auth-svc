import express from "express";
import POST from "./POST"
import GET from "./GET"

const app = express();
app.use(GET, POST);
export default app;