import { useState } from "react";

import "./App.css";
import "../shared/firebase";

import SelectChart from "./compos/SelectChart";

import InfoBox from "./compos/InfoBox";
import InfoContext from "./compos/InfoContext";
import Inputs from "./compos/Inputs";
import OverlayPrinter from "./compos/OverlayPrinter";
import Seats from "./compos/Selectables/Seats";
import Tables from "./compos/Selectables/Tables";
import { SelectedProvider } from "./context/SelectedContext";

import StateToFirestore from "./context/StateToFirestore";
// import FirestoreToState from "./context/FirestoreToState";
import { seatingChartCollection } from "../shared/firebase";
import { getChartIdFromUrl } from "./utils/chartUrl";
import { doc } from "firebase/firestore";
import PartyLinksToFirestore from "./context/PartyLinksToFirestore";

function App() {
   const [chartId, setChartKey] = useState<string | null>(getChartIdFromUrl());

   window.addEventListener("popstate", () => setChartKey(getChartIdFromUrl()));

   return (
      <>
         {chartId === null ? (
            <SelectChart
               chartCollection={seatingChartCollection}
               setChartKey={setChartKey}
            />
         ) : (
            <SelectedProvider docRef={doc(seatingChartCollection, chartId)}>
               <div id="flexie" className="flexie">
                  <InfoBox />
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
         )}
      </>
   );
}

export default App;
