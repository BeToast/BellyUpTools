import "./App.css";
import "../shared/firebase";

import { useState } from "react";
import { doc } from "firebase/firestore";
import { UserCredential } from "firebase/auth";

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

function App() {
   const [chartId, setChartKey] = useState<string | null>(getChartIdFromUrl());
   const localStorageStr = localStorage.getItem("microsoftUserCredential");
   const localStorageObj: {
      credential: UserCredential;
      timestamp: number;
   } | null = localStorageStr ? JSON.parse(localStorageStr) : null;
   const tokenExpired =
      localStorageObj === null ||
      new Date().getTime() - localStorageObj.timestamp > 1209600; //this is two weeks

   //stored token is set if its not experied and if it is not null
   const [storedCredential, setStoredCredential] =
      useState<UserCredential | null>(
         tokenExpired ? null : localStorageObj?.credential
      );

   window.addEventListener("popstate", () => setChartKey(getChartIdFromUrl()));

   return (
      <>
         {storedCredential ? (
            chartId === null ? (
               <SelectChart
                  chartCollection={seatingChartCollection}
                  setChartKey={setChartKey}
               />
            ) : (
               <SelectedProvider docRef={doc(seatingChartCollection, chartId)}>
                  <div id="flexie" className="flexie">
                     <InfoBox storedCredential={storedCredential} />
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
            <MicrosoftOAuth setStoredCredential={setStoredCredential} />
         )}
      </>
   );
}

export default App;
