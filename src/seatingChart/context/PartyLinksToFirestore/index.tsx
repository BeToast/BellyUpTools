import { db } from "@/shared/firebase";
import {
   writeBatch,
   collection,
   getDocs,
   query,
   doc,
} from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { useSelected } from "../SelectedContext";

const PartyLinksToFirestore: React.FC = ({}) => {
   const { partyLinks } = useSelected();

   useEffect(() => {
      syncPartyLinksToFirestore();
      console.log("PartyLinks changed, syncing to Firestore");
   }, [partyLinks]);

   const docRef = doc(db, "SeatingCharts", "devChart");

   const syncPartyLinksToFirestore = async () => {
      console.log("Syncing partyLinks to Firestore", partyLinks);
      const batch = writeBatch(db);
      const partyLinksCollection = collection(docRef, "partyLinks");

      // First, delete all existing documents in the collection
      const existingDocs = await getDocs(query(partyLinksCollection));
      existingDocs.forEach((doc) => {
         batch.delete(doc.ref);
      });

      // Then, add new documents for each party link
      partyLinks.forEach((link, outerIndex) => {
         link.forEach((party, innerIndex) => {
            const docId = `${outerIndex}_${innerIndex}`;
            batch.set(doc(partyLinksCollection, docId), {
               outerIndex,
               innerIndex,
               party,
            });
         });
      });

      await batch.commit();
      console.log("PartyLinks sync to Firestore complete");
   };

   return null;
};

export default PartyLinksToFirestore;
