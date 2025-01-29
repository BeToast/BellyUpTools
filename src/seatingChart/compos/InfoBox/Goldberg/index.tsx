import "./style.css";
import { useSelected } from "../../../context/SelectedContext";
import ToggleSwitch from "../../../../shared/ToggleSwitch";

const _DEBUG = false;

const Goldberg: React.FC<{ aSelectedTable: string; parties: string[] }> = ({
   aSelectedTable,
   // parties,
}) => {
   const { state, setGoldberg } = useSelected();

   return (
      <>
         <div
            className="section"
            style={{
               height: "32px",
               marginTop: "-12px",
               marginBottom: "-12px",
            }}
         >
            <div className="absolute">
               <div className="header horz">
                  Goldberg
                  <div style={{ marginTop: "2px", marginLeft: "6px" }}>
                     <ToggleSwitch
                        checked={state[aSelectedTable]?.goldberg || false}
                        onChange={(event) => {
                           setGoldberg(aSelectedTable, event.target.checked);
                        }}
                     />
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Goldberg;
