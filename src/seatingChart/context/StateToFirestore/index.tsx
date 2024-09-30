import React, { useEffect, useCallback } from "react";
import { useSelected } from "../SelectedContext";
import { setDoc } from "firebase/firestore";

const StateToFirestore: React.FC = () => {
   const { assignedState, docRef, firestoreLoaded } = useSelected();

   const syncToFirestore = useCallback(async () => {
      // console.log("Syncing state to Firestore", assignedState);
      try {
         await setDoc(docRef, { state: assignedState }, { merge: true });
         // console.log("Write to Firestore complete");
      } catch (error) {
         console.error("Error writing to Firestore:", error);
      }
   }, [assignedState]);

   useEffect(() => {
      if (!firestoreLoaded) {
         return undefined;
      }
      // console.log(`assignedState changed, syncing to Firestore`);
      syncToFirestore();
   }, [assignedState, syncToFirestore, firestoreLoaded]);

   return null;
};

export default StateToFirestore;
