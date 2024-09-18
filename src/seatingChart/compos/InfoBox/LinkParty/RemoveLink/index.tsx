import { xSvg } from "../../../../utils/svgs";
import Tooltip from "../../../Tooltip";
import "./style.css";

const RemoveLink: React.FC<{
   currentParty: Array<string>;
   removeLinkHandler: (party: Array<string>) => void;
}> = ({ currentParty, removeLinkHandler }) => {
   return (
      <>
         <Tooltip content={"Remove Party Link"}>
            <div
               onClick={() => removeLinkHandler(currentParty)}
               className="remove-link"
            >
               {xSvg}
            </div>
         </Tooltip>

         {/* <div className="remove-party">{xSvg}</div> */}
      </>
   );
};

export default RemoveLink;
