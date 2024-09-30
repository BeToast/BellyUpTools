import React, { useEffect, useCallback } from "react";
import { useSelected } from "../SelectedContext";
import { setDoc } from "firebase/firestore";
import { flattenPartyLinks, PartyLinks } from "./utils";

const PartyLinksToFirestore: React.FC = () => {
   const { partyLinks, docRef, firestoreLoaded } = useSelected();

   const syncPartyLinksToFirestore = useCallback(async () => {
      // console.log("Syncing partyLinks to Firestore", partyLinks);

      try {
         const flattenedLinks = flattenPartyLinks(partyLinks as PartyLinks);
         await setDoc(docRef, { partyLinks: flattenedLinks }, { merge: true });
         // console.log("PartyLinks sync to Firestore complete");
      } catch (error) {
         console.error("Error writing partyLinks to Firestore:", error);
      }
   }, [partyLinks, docRef]);

   useEffect(() => {
      if (!firestoreLoaded) {
         return undefined;
      }
      // console.log("PartyLinks changed, syncing to Firestore");
      syncPartyLinksToFirestore();
   }, [partyLinks, syncPartyLinksToFirestore, firestoreLoaded]);

   return null;
};

export default PartyLinksToFirestore;
