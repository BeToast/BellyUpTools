import "./App.css";
import "../shared/firebase";

import InfoBox from "./compos/InfoBox";
import InfoContext from "./compos/InfoContext";
import Inputs from "./compos/Inputs";
import OverlayPrinter from "./compos/OverlayPrinter";
import PrintButton from "./compos/PrintButton";
import Seats from "./compos/Selectables/Seats";
import Tables from "./compos/Selectables/Tables";
import { SelectedProvider } from "./context/SelectedContext";

function App() {
   return (
      <>
         <PrintButton />
         <SelectedProvider>
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
         </SelectedProvider>
      </>
   );
}

export default App;
