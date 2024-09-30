// partyLinksUtils.ts

// Update the types to reflect the three-dimensional structure
export type Party = string;
export type PartyLinks = Party[][][];

export interface FlattenedPartyLink {
   outerIndex: number;
   middleIndex: number;
   innerIndex: number;
   party: Party;
}

/**
 * Flattens a three-dimensional PartyLinks array into an array of FlattenedPartyLink objects.
 * @param links The three-dimensional PartyLinks array to flatten.
 * @returns An array of FlattenedPartyLink objects.
 */
export const flattenPartyLinks = (links: PartyLinks): FlattenedPartyLink[] => {
   return links.flatMap((outerArray, outerIndex) =>
      outerArray.flatMap((middleArray, middleIndex) =>
         middleArray.map((party, innerIndex) => ({
            outerIndex,
            middleIndex,
            innerIndex,
            party,
         }))
      )
   );
};

/**
 * Reconstructs a three-dimensional PartyLinks array from an array of FlattenedPartyLink objects.
 * @param flattenedLinks The array of FlattenedPartyLink objects to reconstruct.
 * @returns The reconstructed three-dimensional PartyLinks array.
 */
export const reconstructPartyLinks = (
   flattenedLinks: FlattenedPartyLink[]
): PartyLinks => {
   const reconstructed: PartyLinks = [];
   flattenedLinks.forEach(({ outerIndex, middleIndex, innerIndex, party }) => {
      if (!reconstructed[outerIndex]) reconstructed[outerIndex] = [];
      if (!reconstructed[outerIndex][middleIndex])
         reconstructed[outerIndex][middleIndex] = [];
      reconstructed[outerIndex][middleIndex][innerIndex] = party;
   });
   return reconstructed;
};

/**
 * Converts a FlattenedPartyLink object to a string representation.
 * @param link The FlattenedPartyLink object to convert.
 * @returns A string representation of the FlattenedPartyLink.
 */
export const flattenedPartyLinkToString = (
   link: FlattenedPartyLink
): string => {
   return `${link.outerIndex}_${link.middleIndex}_${link.innerIndex}_${link.party}`;
};

/**
 * Parses a string representation back into a FlattenedPartyLink object.
 * @param str The string representation to parse.
 * @returns The parsed FlattenedPartyLink object.
 */
export const stringToFlattenedPartyLink = (str: string): FlattenedPartyLink => {
   const [outerIndex, middleIndex, innerIndex, party] = str.split("_");
   return {
      outerIndex: parseInt(outerIndex, 10),
      middleIndex: parseInt(middleIndex, 10),
      innerIndex: parseInt(innerIndex, 10),
      party,
   };
};
