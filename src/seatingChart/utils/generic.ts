export const arraysEqual = (a: string[], b: string[]) => {
   if (a === b) return true;
   if (a == null || b == null) return false;
   if (a.length !== b.length) return false;

   for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
   }
   return true;
};

export const isArrayInArrayOfArrays = (
   arr: string[],
   arrayOfArrays: string[][]
): boolean => {
   return arrayOfArrays.some((subArr) => arraysEqual(arr, subArr));
};

export const arraysSameContents = (a: string[], b: string[]) => {
   if (a === b) return true; //make sure they are different references
   if (a == null || b == null) return false; //make sure they are not null
   if (a.length !== b.length) return false; //make sure they are same length

   a.forEach((el) => {
      if (!b.includes(el)) return false;
   });
   return true;
};
