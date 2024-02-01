import express from 'express';
import { returnError, returnSuccess, returnUnauthorized } from "../utility";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, updateProfile } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { UploadedFile } from 'express-fileupload';

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

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
    const data = req.body;

    console.log("/google-login");

    // Save additional user details to Firestore
    const usersCollection = collection(db, 'users');
    const userDoc = doc(usersCollection, data.uid);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      // Document exists
      const userData = userSnapshot.data();
      returnSuccess(res, userData);
    } else {
      // Document doesn't exist, create a new user
      await setDoc(userDoc, {
        email: data.email,
        profilePic: data.photoURL || '', // Use provided profilePic or empty string if not provided
        createdAt: serverTimestamp(), // Timestamp of user creation
      });
      
      // Return success response
      returnSuccess(res, {});
    }
  } catch (error) {
    console.error(error);
    returnError(res, ['Failed to authenticate with Google']);
  }
});

app.post('/changeProfilePic', async (req, res) => {
  const fileArray = Object.values(req.files);
  if (!req.files) {
    returnError(res, ['No files uploaded']);
  } 

  for (const file of fileArray as UploadedFile[]) {
    console.log(file.data);
    const fileBuffer = file.data;
    const storageRef = ref(storage);
    const imagesRef = ref(storageRef, 'profilePics');
    uploadBytes(imagesRef, fileBuffer).then((snapshot) => {
        console.log(snapshot);
        console.log('Uploaded a blob or file!');
        returnSuccess(res, {snapshot});
    }).catch((error) => {
        console.error('Error uploading file:', error);
        returnError(res, ['Error uploading file.']);
    });
  }
});

app.post('/logout', async (req, res) => {
    signOut(auth).then(() => {
        returnSuccess(res, ["logged out"]);
      }).catch((error) => {
        returnError(res, ["Something went wrong"]);
      });
});
  