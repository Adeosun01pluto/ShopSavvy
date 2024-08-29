// utils/firebase.js
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getUserDetails = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    // Assuming you store additional user details in Firestore
    const userDoc = await getUserFromFirestore(user.uid);
    return userDoc;
  } else {
    throw new Error('No user is logged in');
  }
};


// You would also need a function to fetch user data from Firestore
const getUserFromFirestore = async (uid) => {
    try {
        // Reference to the user document in Firestore
        const userDocRef = doc(db, 'users', uid); // Replace 'users' with your collection name if different
        // Fetch the document
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
        return userDoc.data(); // Return user data
        } else {
        throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user from Firestore:', error);
        throw error; // Re-throw error to handle it in the calling function
    
    }
};
