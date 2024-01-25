import express from 'express';
import { returnError, returnSuccess, returnUnauthorized } from "../utility";
import { onAuthStateChanged,  getAuth } from "firebase/auth";
import { OAuth2Client } from 'google-auth-library';
import { googleClientId } from '../../../firebaseConfig';

const auth = getAuth();
const client = new OAuth2Client(googleClientId);

const app = express();
export default app;

app.get('/check', async (req, res) => {
    onAuthStateChanged(auth, (user) => {
        returnSuccess(res, user);
      });
});
