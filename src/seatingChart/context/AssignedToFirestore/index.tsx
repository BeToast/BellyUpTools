import React, { useEffect, useCallback } from "react";
import { useSelected } from "../SelectedContext";
import { setDoc } from "firebase/firestore";

const AssignedToFirestore: React.FC = () => {
   const { assignedState, docRef, firestoreLoaded, setWriting } = useSelected();

   const syncToFirestore = useCallback(async () => {
      if (!firestoreLoaded || !docRef) return;

      const setDocPromise = setDoc(
         docRef,
         { state: assignedState },
         { merge: true }
      )
         .then(() => console.log("Write to Firestore complete"))
         .catch((error) => console.error("Error writing to Firestore:", error));

      //set writing state to true while awaiting for Firestore write to complete
      setWriting(true);
      await setDocPromise;
      setWriting(false);
   }, [assignedState, docRef, firestoreLoaded]);

   useEffect(() => {
      if (!firestoreLoaded) {
         return undefined;
      }
      console.log(
         `assignedState changed or keyToRemove set, syncing to Firestore`
      );
      syncToFirestore();
   }, [assignedState, syncToFirestore, firestoreLoaded]);

   return null;
};

export default AssignedToFirestore;
