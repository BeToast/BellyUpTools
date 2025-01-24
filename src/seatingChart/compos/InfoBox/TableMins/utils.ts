import { tableMinValue } from ".";

// export enum tableMinStatus {
//    NONE = "NONE",
//    INCOMPLETE = "INCOMPLETE",
//    CONFIRMED = "CONFIRMED",
// }

export const getTableMinStatus = (
   minState: tableMinValue,
   useContract?: boolean
): string => {
   // console.log(minState);
   if (!minState) return "NONE";
   if (!minState.hasMin) return "NONE";

   if (
      minState.ticketsPurchased &&
      minState.contractAmount &&
      minState.payableBy &&
      minState.contractSigned
   ) {
      return useContract ? minState.contractAmount : "CONFIRMED";
   }

   return "INCOMPLETE";
};
