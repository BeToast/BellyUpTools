import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelected } from "../../../context/SelectedContext";
import "./style.css";
import RemoveLink from "./RemoveLink";
import LinkIcon from "./LinkIcon";

const LinkParty: React.FC<{
   currParties: Array<string>;
   linkedArrayIndex: number;
   otherCombinedLinkOptions: Array<Array<Array<string>>>;
}> = ({ currParties, linkedArrayIndex, otherCombinedLinkOptions }) => {
   const { partyLinks, addPartyLink, removePartyLink } = useSelected();
   const [isOpen, setIsOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const dropdownRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const handleToggleDropdown = () => {
      setIsOpen(!isOpen);
   };

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
   };

   const linkedArray: Array<Array<string>> =
      linkedArrayIndex !== -1 ? partyLinks[linkedArrayIndex] : [];

   // Filter out subsets and individual parties that are part of a larger set
   const filteredCombinedLinkOptions = useMemo(() => {
      const flattenedLinkedArray = linkedArray.flat();

      // Sort options by length (descending) to prioritize larger sets
      const sortedOptions = [...otherCombinedLinkOptions].sort(
         (a, b) => b[0].length - a[0].length
      );

      return sortedOptions.filter((linkOption, index, self) => {
         const flattenedLinkOption = linkOption.flat(1);

         // Check if this option is not a subset of any other option
         const isNotSubset = !self.some(
            (otherOption, otherIndex) =>
               index !== otherIndex &&
               otherOption.flat(1).length > flattenedLinkOption.length &&
               flattenedLinkOption.every((party) =>
                  otherOption.flat(1).includes(party)
               )
         );

         // Check if the link option doesn't contain current parties or already linked parties
         const doesNotContainCurrentOrLinked = !flattenedLinkOption.some(
            (party) =>
               currParties.includes(party) ||
               flattenedLinkedArray.includes(party)
         );

         return isNotSubset && doesNotContainCurrentOrLinked;
      });
   }, [otherCombinedLinkOptions, currParties, linkedArray, partyLinks]);

   // Filter by the search field
   const searchedLinkOptions = filteredCombinedLinkOptions.filter((party) =>
      party.some((item) =>
         item.join().toLowerCase().includes(searchTerm.toLowerCase())
      )
   );

   return (
      <div ref={dropdownRef} className="linked-party-wrapper">
         {linkedArray.map((currentParty: Array<string>, index) => (
            <div key={index} className="linked-party">
               <RemoveLink
                  currentParty={currentParty}
                  removeLinkHandler={() =>
                     removePartyLink(currentParty, linkedArrayIndex)
                  }
               />
               {removeUnderscore(currentParty)}
            </div>
         ))}
         {filteredCombinedLinkOptions.length > 0 && (
            <input
               type="text"
               className="party-input"
               placeholder={
                  linkedArray.length > 0
                     ? "Link Another Party"
                     : "Search Parties to Link"
               }
               value={searchTerm}
               onFocus={handleToggleDropdown}
               onBlur={handleToggleDropdown}
               onChange={handleSearchChange}
            />
         )}
         {isOpen && (
            <>
               <div className="scroll-y">
                  {searchedLinkOptions.map((party, index) => (
                     <div
                        className="link-option"
                        key={index}
                        onMouseDown={() => addPartyLink(currParties, party[0])}
                     >
                        <LinkIcon />
                        {removeUnderscore(party.flat())}
                     </div>
                  ))}
               </div>
            </>
         )}
      </div>
   );
};

export default LinkParty;

const removeUnderscore = (party: Array<string>) => {
   const joinedParty = party.join(", ");
   return joinedParty.startsWith("_") ? joinedParty.substring(1) : joinedParty;
};
