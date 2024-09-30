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
   const { assignedState, docRef, firestoreLoaded } = useSelected();

   const syncToFirestore = useCallback(async () => {
      if (!firestoreLoaded || !docRef) return;

      // const batch = writeBatch(db);
      try {
         // Update the state
         // batch.set(docRef, { state: assignedState }, { merge: true });
         setDoc(docRef, { state: assignedState }, { merge: true });

         // Handle keyToRemove if it exists
         // if (keyToRemove) {
         //    batch.update(docRef, {
         //       [`state.${keyToRemove}`]: deleteField(),
         //    });
         //    setKeyToRemove(null); // Reset keyToRemove after handling
         // }

         // // Commit the batch
         // await batch.commit();
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
   }, [assignedState, syncToFirestore, firestoreLoaded]);

   return null;
};

export default StateToFirestore;
