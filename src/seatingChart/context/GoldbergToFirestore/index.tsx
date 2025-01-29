import React, { useEffect, useCallback } from "react";
import { useSelected } from "../SelectedContext";
import { setDoc } from "firebase/firestore";

const GoldbergToFirestore: React.FC = () => {
   const { goldbergState, docRef, firestoreLoaded, setWriting } = useSelected();

   const syncToFirestore = useCallback(async () => {
      if (!firestoreLoaded || !docRef) return;
      const setDocPromise = setDoc(
         docRef,
         { goldberg: goldbergState },
         { merge: true }
      )
         .then(() => console.log("Write to Firestore complete"))
         .catch((error) => console.error("Error writing to Firestore:", error));

      //set writing state to true while awaiting for Firestore write to complete
      setWriting(true);
      await setDocPromise;
      setWriting(false);
   }, [goldbergState, docRef, firestoreLoaded]);

   useEffect(() => {
      if (!firestoreLoaded) {
         return undefined;
      }
      // console.log(`goldbergState changed, syncing to Firestore`);
      syncToFirestore();
   }, [goldbergState, syncToFirestore, firestoreLoaded]);

   return null;
};

export default GoldbergToFirestore;
