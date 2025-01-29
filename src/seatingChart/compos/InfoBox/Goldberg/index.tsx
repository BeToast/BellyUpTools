import "./style.css";
import { useSelected } from "../../../context/SelectedContext";
import ToggleSwitch from "../../../../shared/ToggleSwitch";

const _DEBUG = false;

const Goldberg: React.FC<{}> = ({}) => {
   const {} = useSelected();

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
                  Goldberg Table
                  <div style={{ marginTop: "2px", marginLeft: "6px" }}>
                     <ToggleSwitch checked={false} onChange={() => {}} />
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Goldberg;
