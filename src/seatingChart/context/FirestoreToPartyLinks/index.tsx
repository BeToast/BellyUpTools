import { db } from "@/shared/firebase";
import { collection, onSnapshot, query, doc } from "firebase/firestore";
import { useEffect } from "react";
import { useSelected } from "../SelectedContext";

const FirestoreToPartyLinks: React.FC = () => {
   const { setPartyLinks } = useSelected();

   useEffect(() => {
      const docRef = doc(db, "SeatingCharts", "devChart");
      const partyLinksCollection = collection(docRef, "partyLinks");
      const q = query(partyLinksCollection);

      const unsubscribe = onSnapshot(q, (snapshot) => {
         console.log("Syncing Firestore to partyLinks");
         const newPartyLinks: Array<Array<Array<string>>> = [];

         snapshot.forEach((doc) => {
            const data = doc.data();
            if (!newPartyLinks[data.outerIndex]) {
               newPartyLinks[data.outerIndex] = [];
            }
            if (!newPartyLinks[data.outerIndex][data.innerIndex]) {
               newPartyLinks[data.outerIndex][data.innerIndex] = [];
            }
            newPartyLinks[data.outerIndex][data.innerIndex] = data.party;
         });

         setPartyLinks((prevLinks) => {
            if (JSON.stringify(prevLinks) !== JSON.stringify(newPartyLinks)) {
               console.log("PartyLinks updated from Firestore", newPartyLinks);
               return newPartyLinks;
            }
            return prevLinks;
         });
      });

      return () => unsubscribe(); // Cleanup on component unmount
   }, [setPartyLinks]);

   return null;
};

export default FirestoreToPartyLinks;
