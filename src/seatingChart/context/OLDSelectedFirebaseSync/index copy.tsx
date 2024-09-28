import React, { useEffect, useRef, useCallback } from "react";
import { recordValue, useSelected } from "../SelectedContext";
import {
   doc,
   collection,
   onSnapshot,
   writeBatch,
   query,
   getDocs,
   setDoc,
} from "firebase/firestore";
import { db } from "../../../shared/firebase";
import { arraysSameContents, arraysEqual } from "../../utils/generic";

const SelectedFirebaseSync: React.FC = () => {
   const { partyLinks, state, setPartyLinks, setState } = useSelected();
   const docRef = doc(db, "SeatingCharts", "devChart");
   // const isUpdatingRef = useRef(false);

   const detectChanges = (
      firestoreData: any,
      newState: Record<string, recordValue>
   ) => {
      const changes: { [key: string]: any } = {};
      let hasChanges = false;

      for (const [key, value] of Object.entries(newState)) {
         const currentAssigned = firestoreData[key]?.assigned || [];
         const newAssigned = value.assigned || [];

         if (!arraysSameContents(currentAssigned, newAssigned)) {
            hasChanges = true;
            changes[key] = {
               ...firestoreData[key],
               assigned: newAssigned,
            };
         }
      }

      return { hasChanges, changes };
   };

   const syncStateToFirestore = useCallback(async () => {
      console.log("Checking for changes to sync to Firestore");
      const stateCollection = collection(docRef, "State");

      // Fetch current Firestore data
      const snapshot = await getDocs(stateCollection);
      const firestoreData: { [key: string]: any } = {};
      snapshot.forEach((doc) => {
         firestoreData[doc.id] = doc.data();
      });

      const { hasChanges, changes } = detectChanges(firestoreData, state);

      if (hasChanges) {
         console.log("Syncing state to Firestore", changes);
         for (const [key, value] of Object.entries(changes)) {
            await setDoc(
               doc(stateCollection, key),
               {
                  assigned: value.assigned,
               },
               { merge: true }
            );
         }
         console.log("State sync to Firestore complete");
      } else {
         console.log("No changes detected, skipping Firestore sync");
      }
   }, [state]);

   const syncFirestoreToState = useCallback(
      (snapshot: any) => {
         console.log("Checking for changes from Firestore");
         const newData: { [key: string]: any } = {};
         snapshot.forEach((doc: any) => {
            newData[doc.id] = doc.data();
         });

         const { hasChanges, changes } = detectChanges(state, newData);

         if (hasChanges) {
            console.log("Syncing Firestore to state", changes);
            setState((prevState) => ({
               ...prevState,
               ...changes,
            }));
         } else {
            console.log("No changes detected from Firestore");
         }
      },
      [state, setState]
   );

   // Function to sync partyLinks to Firestore
   const syncPartyLinksToFirestore = useCallback(async () => {
      // console.log("Syncing partyLinks to Firestore", partyLinks);
      // const batch = writeBatch(db);
      // const partyLinksCollection = collection(docRef, "partyLinks");
      // // First, delete all existing documents in the collection
      // const existingDocs = await getDocs(query(partyLinksCollection));
      // existingDocs.forEach((doc) => {
      //    batch.delete(doc.ref);
      // });
      // // Then, add new documents for each party link
      // partyLinks.forEach((link, outerIndex) => {
      //    link.forEach((party, innerIndex) => {
      //       const docId = `${outerIndex}_${innerIndex}`;
      //       batch.set(doc(partyLinksCollection, docId), {
      //          outerIndex,
      //          innerIndex,
      //          party,
      //       });
      //    });
      // });
      // await batch.commit();
      // console.log("PartyLinks sync to Firestore complete");
   }, [partyLinks, docRef]);

   // Function to sync Firestore to partyLinks
   const syncFirestoreToPartyLinks = useCallback(
      (snapshot: any) => {
         // console.log("Syncing Firestore to partyLinks");
         // const newPartyLinks: Array<Array<Array<string>>> = [];
         // snapshot.forEach((doc: any) => {
         //    const data = doc.data();
         //    if (!newPartyLinks[data.outerIndex])
         //       newPartyLinks[data.outerIndex] = [];
         //    newPartyLinks[data.outerIndex][data.innerIndex] = data.party;
         // });
         // setPartyLinks((prevLinks) => {
         //    if (JSON.stringify(prevLinks) !== JSON.stringify(newPartyLinks)) {
         //       console.log("PartyLinks updated from Firestore", newPartyLinks);
         //       return newPartyLinks;
         //    }
         //    return prevLinks;
         // });
      },
      [setPartyLinks]
   );

   useEffect(() => {
      console.log("Setting up Firestore listeners");
      const unsubscribeState = onSnapshot(
         collection(docRef, "State"),
         (snapshot) => {
            console.log("Firestore State snapshot received");
            syncFirestoreToState(snapshot);
         }
      );

      // const unsubscribePartyLinks = onSnapshot(
      //    collection(docRef, "partyLinks"),
      //    (snapshot) => {
      //       console.log("Firestore PartyLinks snapshot received");
      //       syncFirestoreToPartyLinks(snapshot);
      //    }
      // );

      return () => {
         console.log("Cleaning up Firestore listeners");
         unsubscribeState();
         // unsubscribePartyLinks();
      };
   }, [docRef, syncFirestoreToState, syncFirestoreToPartyLinks]);

   // useEffect(() => {
   //    const timeoutId = setTimeout(() => {
   //       syncStateToFirestore();
   //    }, 1000);
   //    return () => clearTimeout(timeoutId);
   // }, [state, syncStateToFirestore]);
   useEffect(() => {
      syncStateToFirestore();
   }, [state, syncStateToFirestore]);

   // useEffect(() => {
   //    const timeoutId = setTimeout(() => {
   //       syncPartyLinksToFirestore();
   //    }, 1000);
   //    return () => clearTimeout(timeoutId);
   // }, [partyLinks, syncPartyLinksToFirestore]);

   return null;
};

export default SelectedFirebaseSync;
