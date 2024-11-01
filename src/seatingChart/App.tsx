import "./App.css";
import "../shared/firebase";

import { useState, useEffect } from "react";
import { doc } from "firebase/firestore";
import { UserCredential, getAuth, onAuthStateChanged } from "firebase/auth";

import SelectChart from "./compos/SelectChart";
import InfoBox from "./compos/InfoBox";
import InfoContext from "./compos/InfoContext";
import Inputs from "./compos/Inputs";
import OverlayPrinter from "./compos/OverlayPrinter";
import Seats from "./compos/Selectables/Seats";
import Tables from "./compos/Selectables/Tables";
import { SelectedProvider } from "./context/SelectedContext";
import StateToFirestore from "./context/StateToFirestore";
import { seatingChartCollection } from "../shared/firebase";
import { getChartIdFromUrl } from "./utils/chartUrl";
import PartyLinksToFirestore from "./context/PartyLinksToFirestore";
import MicrosoftOAuth from "../shared/MicrosoftOAuth";
import BackButton from "../shared/BackButton";

function App() {
   const [chartId, setChartKey] = useState<string | null>(getChartIdFromUrl());
   const [user, setUser] = useState<UserCredential | null>(null);
   const [loading, setLoading] = useState(true);
   const auth = getAuth();

   useEffect(() => {
      // Set up auth state observer
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         if (currentUser) {
            // If we have a valid user session, get their credentials
            // Note: You might need to adjust this based on how your Microsoft OAuth
            // integration provides the UserCredential object
            setUser({
               user: currentUser,
               providerId: currentUser.providerId,
               operationType: "signIn",
            } as UserCredential);
         } else {
            setUser(null);
         }
         setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
   }, [auth]);

   // Event listeners
   useEffect(() => {
      const handlePopState = () => setChartKey(getChartIdFromUrl());
      const handleBeforePrint = () => {
         if (chartId) {
            document.title = `SeatingChart_${chartId.replace(" ", "")}`;
         }
      };
      const handleAfterPrint = () => {
         document.title = "Seating Chart Builder";
      };

      window.addEventListener("popstate", handlePopState);
      window.addEventListener("beforeprint", handleBeforePrint);
      window.addEventListener("afterprint", handleAfterPrint);

      return () => {
         window.removeEventListener("popstate", handlePopState);
         window.removeEventListener("beforeprint", handleBeforePrint);
         window.removeEventListener("afterprint", handleAfterPrint);
      };
   }, [chartId]);

   if (loading) {
      return <div>Loading...</div>;
   }

   return (
      <>
         <BackButton />
         {user ? (
            chartId === null ? (
               <>
                  <SelectChart
                     chartCollection={seatingChartCollection}
                     setChartKey={setChartKey}
                  />
               </>
            ) : (
               <SelectedProvider docRef={doc(seatingChartCollection, chartId)}>
                  <div id="flexie" className="flexie">
                     <InfoBox storedCredential={user} />
                     <main id="letter-paper" className="letter-paper">
                        <Inputs />
                        <Tables />
                        <Seats />
                        <OverlayPrinter />
                     </main>
                     <div className="pixels200" />
                     <InfoContext />
                  </div>

                  <StateToFirestore />
                  <PartyLinksToFirestore />
               </SelectedProvider>
            )
         ) : (
            <MicrosoftOAuth setStoredCredential={setUser} />
         )}
      </>
   );
}

export default App;
