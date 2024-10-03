import "./style.css";
import { thinXSvg } from "../../../../utils/svgs";
import Modal from "../../../../compos/Modal";
import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../../../shared/firebase";
import Loading from "../../../../compos/Loading";

const DeleteChart: React.FC<{ name: string }> = ({ name }) => {
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);

   const deleteHandler = async (docKey: string) => {
      setIsLoading(true);
      try {
         await deleteDoc(doc(db, "SeatingCharts", docKey));
         location.reload();
         setIsModalOpen(false);
      } catch (err) {
         console.error("Error deleting document: ", err);
         setError("Failed to delete. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <>
         <div
            className="chart-icon"
            onClick={(e: React.MouseEvent) => {
               e.stopPropagation();
               setIsModalOpen(true);
            }}
         >
            {thinXSvg}
         </div>
         <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {error ? (
               <>
                  <div className="center-center">{error}</div>
               </>
            ) : isLoading ? (
               <>
                  <Loading />
               </>
            ) : (
               <>
                  <h2>Delete Seating Chart?</h2>
                  <p>
                     Are you sure you want to delete{" "}
                     <span style={{ fontWeight: "800" }}>{name}</span>? Deletion
                     is irreverisble.
                  </p>
                  <div
                     className="delete-button"
                     onClick={() => deleteHandler(name)}
                  >
                     Perementaly Delete
                  </div>
               </>
            )}
         </Modal>
      </>
   );
};

export default DeleteChart;
