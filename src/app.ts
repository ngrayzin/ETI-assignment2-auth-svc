import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
const API_PORT = process.env.API_PORT || 3018;

const firebase = initializeApp(firebaseConfig);

import { getAuth } from "firebase/auth";
import authAPI from './api/auth';
const auth = getAuth(firebase);

const app = express();

app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:3018',
  ],
  credentials: true,
}));

app.use(bodyParser.json());
// Your API routes go here
app.use(
    authAPI,
);

app.listen(API_PORT, () => {
  console.log('Server Listening on PORT:', API_PORT);
});