import React, { useEffect, useCallback } from "react";
import { useSelected } from "../SelectedContext";
import { doc, collection, setDoc } from "firebase/firestore";
import { db } from "../../../shared/firebase";

const StateToFirestore: React.FC = () => {
   const { assignedState } = useSelected();

   const syncToFirestore = useCallback(async () => {
      const docRef = doc(db, "SeatingCharts", "devChart");
      const stateCollection = collection(docRef, "State");

      console.log("Syncing state to Firestore", assignedState);

      for (const [key, value] of Object.entries(assignedState)) {
         await setDoc(
            doc(stateCollection, key),
            {
               assigned: value,
            },
            { merge: true }
         );
      }

      console.log("State sync to Firestore complete");
   }, [assignedState]);

   useEffect(() => {
      console.log(`assignedState changed, syncing to Firestore`);
      syncToFirestore();
   }, [assignedState, syncToFirestore]);

   // console.log(`StateToFirestore component mounted`);

   return null;
};

export default StateToFirestore;
