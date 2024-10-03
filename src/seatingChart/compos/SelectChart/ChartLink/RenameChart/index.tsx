import "./style.css";

import React, { useState } from "react";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "../../../../../shared/firebase";
import Modal from "../../../../compos/Modal";
import Loading from "../../../../compos/Loading";
import { pencilSvg } from "../../../../utils/svgs";

const RenameChart: React.FC<{ name: string }> = ({ name }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [newName, setNewName] = useState(name);

   const renameHandler = async (oldDocKey: string) => {
      setError(null);
      if (!newName.trim()) {
         setError("Please enter a new name.");
         return;
      }
      setIsLoading(true);

      try {
         await runTransaction(db, async (transaction) => {
            const oldDocRef = doc(db, "SeatingCharts", oldDocKey);
            const oldDocSnap = await transaction.get(oldDocRef);

            if (!oldDocSnap.exists()) {
               throw new Error("Document does not exist!");
            }

            const newDocRef = doc(db, "SeatingCharts", newName);
            const newDocSnap = await transaction.get(newDocRef);

            if (newDocSnap.exists()) {
               setError("A document with this name already exists!");
            }

            const oldData = oldDocSnap.data();
            transaction.set(newDocRef, { ...oldData, name: newName });
            transaction.delete(oldDocRef);
         });
         location.reload();
         setIsModalOpen(false);
      } catch (err) {
         console.error("Error renaming document: ", err);
         setError(
            err instanceof Error
               ? err.message
               : "Failed to rename. Please try again."
         );
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <>
         <div
            className="chart-icon rename-chart"
            onClick={() => {
               setIsModalOpen(true);
            }}
         >
            {pencilSvg}
         </div>
         <Modal
            isOpen={isModalOpen}
            onClose={() => {
               setIsModalOpen(false);
            }}
         >
            <div className="rename-modal-content">
               {error ? (
                  <div className="error-message">{error}</div>
               ) : isLoading ? (
                  <Loading />
               ) : (
                  <>
                     <div className="vert-flex-no-pad">
                        <h2>Rename Seating Chart</h2>
                        <input
                           type="text"
                           value={newName}
                           onChange={(e) => {
                              setNewName(e.target.value);
                           }}
                           className="name-input-n width-100"
                        />
                        <button
                           onClick={() => {
                              renameHandler(name);
                           }}
                           className="rename-button"
                        >
                           Rename
                        </button>
                     </div>
                  </>
               )}
            </div>
         </Modal>
      </>
   );
};

export default RenameChart;

// import "./style.css";

// import { useState } from "react";
// import { pencilSvg } from "../../../../utils/svgs";
// import Modal from "../../../../compos/Modal";
// import { doc } from "firebase/firestore";
// import { db } from "../../../../../shared/firebase";
// import Loading from "../../../../compos/Loading";

// const RenameChart: React.FC<{ name: string }> = ({ name }) => {
//    const [isModalOpen, setIsModalOpen] = useState(false);
//    const [isLoading, setIsLoading] = useState<boolean>(false);
//    const [error, setError] = useState<string | null>(null);

//    const renameHandler = (e: React.MouseEvent, docKey: string) => {
//       e.stopPropagation();
//       setIsLoading(true);
//       try {
//          doc(db, "SeatingCharts", docKey); //this is the document to rename
//          //your code here

//          setIsModalOpen(false);
//       } catch (err) {
//          console.error("Error renaming: ", err);
//          setError("Failed to rename. Please try again.");
//       } finally {
//          setIsLoading(false);
//       }
//    };

//    return (
//       <>
//          <div
//             className="chart-icon rename-chart"
//             onClick={(e: React.MouseEvent) => {
//                e.stopPropagation();
//                setIsModalOpen(true);
//             }}
//          >
//             {pencilSvg}
//          </div>
//          <Modal
//             isOpen={isModalOpen}
//             onClose={(e: React.MouseEvent) => {
//                e.stopPropagation();
//                setIsModalOpen(false);
//             }}
//          >
//             {error ? (
//                <>
//                   <div className="center-center">{error}</div>
//                </>
//             ) : isLoading ? (
//                <>
//                   <Loading />
//                </>
//             ) : (
//                <>
//                   <h2>Rename Seating Chart</h2>
//                   <p>Enter new name.</p>
//                   <div
//                      className=""
//                      onClick={(e) => renameHandler(e, name)}
//                   ></div>
//                </>
//             )}
//          </Modal>
//       </>
//    );
// };

// export default RenameChart;
