import { xSvg } from "../../../utils/svgs";
import Tooltip from "../../Tooltip";
import "./style.css";

const RemoveParty: React.FC<{
   party: string;
   removePartyHandler: (party: string) => void;
}> = ({ party, removePartyHandler }) => {
   return (
      <>
         <Tooltip content={"Remove Party"}>
            <div
               onClick={() => removePartyHandler(party)}
               className="remove-party"
            >
               {xSvg}
            </div>
         </Tooltip>
      </>
   );
};

export default RemoveParty;
