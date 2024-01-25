import express from 'express';
import { returnError, returnSuccess, returnUnauthorized } from "../utility";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, updateProfile } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getAuth as adminGetAuth } from 'firebase-admin/auth';

const auth = getAuth();
const db = getFirestore();

const app = express();
export default app;

app.post('/signup', async (req, res) => {
  try {
      const { email, password, name, profilePic } = req.body;

      // Validate input
      if (!email || !password || !name) {
          returnError(res, ["Invalid parameters"]);
          return;
      }
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name for the user
      await updateProfile(user, { displayName: name });

      // Save additional user details to Firestore
      const usersCollection = collection(db, 'users');
      const userDoc = doc(usersCollection, user.uid);

      await setDoc(userDoc, {
          email,
          profilePic: profilePic || '', // Use provided profilePic or empty string if not provided
          createdAt: serverTimestamp(), // Timestamp of user creation
      });

      returnSuccess(res, user);
  } catch (error) {
      console.error(error);
      returnError(res, ["Invalid credientials"]);
  }
});
  
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(email === undefined || password === undefined){
      returnError(res, ["Invalid parameters"]);
    }
    console.log("/login")
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      returnSuccess(res, user.providerData[0]);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      returnError(res, [errorCode, errorMessage]);
    });
  } catch (error) {
    console.error(error);
    returnUnauthorized(res);
  }
});

app.post('/google-login', async (req, res) => {
  try {
    //req.body

    returnSuccess(res, { success: true, user: {}});
  } catch (error) {
    console.error(error);
    returnError(res,  ['Failed to authenticate with Google'])
  }
});

app.post('/logout', async (req, res) => {
    signOut(auth).then(() => {
        returnSuccess(res, ["logged out"]);
      }).catch((error) => {
        returnError(res, ["Something went wrong"]);
      });
});
  