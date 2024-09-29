// import React, { useEffect } from "react";
// import { useSelected } from "../SelectedContext";
// import { RecordValue } from "../../context/SelectedContext";
// import { doc, collection, onSnapshot } from "firebase/firestore";
// import { db } from "../../../shared/firebase";

// const FirestoreToState: React.FC = () => {
//    const { setState, setFirestoreLoaded } = useSelected();

//    useEffect(() => {
//       console.log("Setting up Firestore listener");
//       const docRef = doc(db, "SeatingCharts", "devChart");
//       const stateCollection = collection(docRef, "State");

//       const unsubscribe = onSnapshot(
//          stateCollection,
//          (snapshot) => {
//             console.log("Received update from Firestore");

//             setState((prevState) => {
//                const newState: Record<string, RecordValue> = { ...prevState };

//                snapshot.forEach((doc) => {
//                   const data = doc.data();
//                   console.log(data);
//                   if (data.assigned && Array.isArray(data.assigned)) {
//                      newState[doc.id] = {
//                         ...prevState[doc.id], // Preserve existing properties
//                         assigned: data.assigned,
//                         selected: prevState[doc.id]?.selected ?? false,
//                         ref:
//                            prevState[doc.id]?.ref ??
//                            React.createRef<HTMLDivElement>(),
//                      };
//                   }
//                });

//                console.log("Updating local state with Firestore data");

//                return newState;
//             });
//             setFirestoreLoaded(true);
//          },
//          (error) => {
//             console.error("Error listening to Firestore:", error);
//          }
//       );

//       // Cleanup function to unsubscribe from the listener when the component unmounts
//       return () => {
//          console.log("Cleaning up Firestore listener");
//          unsubscribe();
//       };
//    }, [setState]);

//    return null;
// };

// export default FirestoreToState;
