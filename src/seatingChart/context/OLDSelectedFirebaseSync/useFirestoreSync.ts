// import { useEffect, useCallback, useState } from "react";
// import { recordValue, useSelected } from "../SelectedContext";
// import { doc, collection, onSnapshot, setDoc } from "firebase/firestore";
// import { db } from "../../../shared/firebase";
// import { arraysSameContents } from "../../utils/generic";

// export const useFirestoreSync = () => {
//    const { state, setState } = useSelected();
//    const docRef = doc(db, "SeatingCharts", "devChart");
//    const [firestoreData, setFirestoreData] = useState<{ [key: string]: any }>(
//       {}
//    );

//    const detectChanges = (
//       currentData: { [key: string]: any },
//       newData: Record<string, recordValue>
//    ) => {
//       const changes: { [key: string]: any } = {};
//       let hasChanges = false;

//       for (const [key, value] of Object.entries(newData)) {
//          const currentAssigned = currentData[key]?.assigned || [];
//          const newAssigned = value.assigned || [];

//          if (!arraysSameContents(currentAssigned, newAssigned)) {
//             hasChanges = true;
//             changes[key] = {
//                ...currentData[key],
//                assigned: newAssigned,
//             };
//          }
//       }

//       return { hasChanges, changes };
//    };

//    const syncStateToFirestore = useCallback(async () => {
//       console.log("Checking for changes to sync to Firestore");
//       const stateCollection = collection(docRef, "State");

//       const { hasChanges, changes } = detectChanges(firestoreData, state);

//       if (hasChanges) {
//          console.log("Syncing state to Firestore", changes);
//          for (const [key, value] of Object.entries(changes)) {
//             await setDoc(
//                doc(stateCollection, key),
//                {
//                   assigned: value.assigned,
//                },
//                { merge: true }
//             );
//          }
//          console.log("State sync to Firestore complete");
//       } else {
//          console.log("No changes detected, skipping Firestore sync");
//       }
//    }, [state, firestoreData]);

//    const syncFirestoreToState = useCallback(
//       (newFirestoreData: { [key: string]: any }) => {
//          console.log("Checking for changes from Firestore");

//          const { hasChanges, changes } = detectChanges(state, newFirestoreData);

//          if (hasChanges) {
//             console.log("Syncing Firestore to state", changes);
//             setState((prevState) => ({
//                ...prevState,
//                ...changes,
//             }));
//          } else {
//             console.log("No changes detected from Firestore");
//          }
//       },
//       [state, setState]
//    );

//    useEffect(() => {
//       console.log("Setting up Firestore listener");
//       const unsubscribeState = onSnapshot(
//          collection(docRef, "State"),
//          (snapshot) => {
//             console.log("Firestore State snapshot received");
//             const newData: { [key: string]: any } = {};
//             snapshot.forEach((doc) => {
//                newData[doc.id] = doc.data();
//             });
//             setFirestoreData(newData);
//             syncFirestoreToState(newData);
//          }
//       );

//       return () => {
//          console.log("Cleaning up Firestore listener");
//          unsubscribeState();
//       };
//    }, [syncFirestoreToState]);

//    useEffect(() => {
//       syncStateToFirestore();
//    }, [state, syncStateToFirestore]);
// };
