import { strangersSvg, togetherSvg } from "../../../utils/svgs";
import Tooltip from "../../Tooltip";
import "./style.css";

const PartyConnected: React.FC<{
   party: string;
   connectHandler: () => void;
   disconnectHandler: () => void;
}> = ({ party, connectHandler, disconnectHandler }) => {
   const isConnected = !party.startsWith("_");

   if (isConnected) {
      return (
         <>
            <Tooltip content={"Mark as strangers"}>
               <div onClick={disconnectHandler} className="connected-button">
                  <div style={{ padding: "4px" }}>{togetherSvg}</div>
               </div>
            </Tooltip>
         </>
      );
   } else {
      return (
         <>
            <Tooltip content={"Mark as together"}>
               <div onClick={connectHandler} className="connected-button">
                  <div style={{ padding: "5px" }}>{strangersSvg}</div>
               </div>
            </Tooltip>
         </>
      );
   }
};

export default PartyConnected;
