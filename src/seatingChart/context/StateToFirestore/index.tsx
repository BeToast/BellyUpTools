import React, { useEffect, useCallback } from "react";
import { useSelected } from "../SelectedContext";
import {
   setDoc,
   deleteField,
   writeBatch,
   FieldValue,
} from "firebase/firestore";
import { db } from "../../../shared/firebase";

const StateToFirestore: React.FC = () => {
   const {
      assignedState,
      keyToRemove,
      setKeyToRemove,
      docRef,
      firestoreLoaded,
   } = useSelected();
   console.log("assignedState", assignedState);

   const syncToFirestore = useCallback(async () => {
      if (!firestoreLoaded || !docRef) return;

      const batch = writeBatch(db);
      try {
         // Update the state
         batch.set(docRef, { state: assignedState }, { merge: true });

         console.log(`Attempting to remove key: state.${keyToRemove}`);
         // Handle keyToRemove if it exists
         if (keyToRemove) {
            batch.update(docRef, {
               [`state.${keyToRemove}`]: deleteField(),
            });
            setKeyToRemove(null); // Reset keyToRemove after handling
         }

         // Commit the batch
         await batch.commit();
         console.log("Write to Firestore complete");
      } catch (error) {
         console.error("Error writing to Firestore:", error);
      }
   }, [assignedState, docRef, firestoreLoaded]);

   useEffect(() => {
      if (!firestoreLoaded) {
         return undefined;
      }
      console.log(
         `assignedState changed or keyToRemove set, syncing to Firestore`
      );
      syncToFirestore();
   }, [assignedState, keyToRemove, syncToFirestore, firestoreLoaded]);

   return null;
};

export default StateToFirestore;
