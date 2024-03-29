import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
const API_PORT = process.env.API_PORT || 3018;
import fileUpload from 'express-fileupload';

const firebase = initializeApp(firebaseConfig);

import { getAuth } from "firebase/auth";
import authAPI from './api/auth';
import { getFirestore as adminFireStore} from 'firebase-admin/firestore';
const auth = getAuth(firebase);

const app = express();

app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
}));

app.use(fileUpload());
app.use(bodyParser.json());
// Your API routes go here
app.use(
    authAPI,
);

app.listen(API_PORT, () => {
  console.log('Server Listening on PORT:', API_PORT);
});