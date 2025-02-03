import stringify from "json-stable-stringify";

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

export const hashRecord = (
   record: Record<string, Array<string> | boolean>
): string => {
   return stringify(record);
};

export const isValidDate = (dateString: string): boolean => {
   // Enhanced regex for basic format and range check
   const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/;

   if (!dateRegex.test(dateString)) {
      return false;
   }

   // Additional checks for valid month and day
   const [month, day, year] = dateString.split("-").map(Number);

   // Check for months with 30 days
   if ([4, 6, 9, 11].includes(month) && day > 30) {
      return false;
   }

   // Check for February
   if (month === 2) {
      // Check for leap year
      const isLeapYear =
         (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      if (day > (isLeapYear ? 29 : 28)) {
         return false;
      }
   }

   return true;
};

export const hash = (obj: any): number => {
   return JSON.stringify(obj)
      .split("")
      .reduce((a, b) => {
         a = (a << 5) - a + b.charCodeAt(0);
         return a & a;
      }, 0);
};
