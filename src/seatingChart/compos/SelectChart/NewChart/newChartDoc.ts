import { seatingChartCollection } from "../../../../shared/firebase";
import { doc, setDoc } from "firebase/firestore";

export const newChartDoc = async (
   show: string,
   date: string
): Promise<string> => {
   try {
      const state: { [key: string]: string[] } = {};

      // Create entries for Seat k1 to k16
      for (let i = 1; i <= 16; i++) {
         state[`Seat k${i}`] = [];
      }

      // Create entries for Seat b1 to b14
      for (let i = 1; i <= 14; i++) {
         state[`Seat b${i}`] = [];
      }

      // Create entries for Table 10 to 21
      for (let i = 10; i <= 21; i++) {
         state[`Table ${i}`] = [];
      }

      const docData = {
         inputs: {
            show,
            date,
         },
         state,
      };

      // Add a new document with a generated ID
      const docRef = doc(seatingChartCollection, `${show} ${date}`);
      // Set the document data
      await setDoc(docRef, docData);
      return docRef.id;
   } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
   }
};
