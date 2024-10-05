import React, { useEffect, useCallback } from "react";
import { useSelected } from "../SelectedContext";
import { setDoc } from "firebase/firestore";
import { flattenPartyLinks, PartyLinks } from "./utils";

const PartyLinksToFirestore: React.FC = () => {
   const { partyLinks, docRef, firestoreLoaded, setWriting } = useSelected();

   const syncPartyLinksToFirestore = useCallback(async () => {
      // console.log("Syncing partyLinks to Firestore", partyLinks);

      const flattenedLinks = flattenPartyLinks(partyLinks as PartyLinks);
      const setDocPromise = setDoc(
         docRef,
         { partyLinks: flattenedLinks },
         { merge: true }
      )
         .then(() => console.log("PartyLinks sync to Firestore complete"))
         .catch((error) =>
            console.error("Error writing partyLinks to Firestore:", error)
         );

      //set writing state to true while awaiting for Firestore write to complete
      setWriting(true);
      await setDocPromise;
      setWriting(false);
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
