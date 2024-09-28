import React, { useEffect, useCallback } from "react";
import { useSelected } from "../SelectedContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../shared/firebase";

const StateToFirestore: React.FC = () => {
   const { assignedState } = useSelected();

   const syncToFirestore = useCallback(async () => {
      const docRef = doc(db, "SeatingCharts", "devChart");

      console.log("Syncing state to Firestore", assignedState);

      try {
         await setDoc(docRef, { state: assignedState }, { merge: true });
         console.log("Write to Firestore complete");
      } catch (error) {
         console.error("Error writing to Firestore:", error);
      }
   }, [assignedState]);

   useEffect(() => {
      console.log(`assignedState changed, syncing to Firestore`);
      syncToFirestore();
   }, [assignedState, syncToFirestore]);

   return null;
};

export default StateToFirestore;
