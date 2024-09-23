export class MyDate {
   month: number;
   day: number;
   year: number;

   // constructor(month: number, day: number, year: number) {
   //    this.month = month;
   //    this.day = day;
   //    this.year = year;
   // }

   constructor(completed: string) {
      const dateRegex = /(\d{2})\/(\d{2})\/(\d{4})/;
      console.log(typeof completed);
      const match = completed.match(dateRegex);

      if (match) {
         this.month = parseInt(match[1], 10);
         this.day = parseInt(match[2], 10);
         this.year = parseInt(match[3], 10);
      } else {
         throw new Error("Invalid date format");
      }
   }

   toString() {
      return `${this.month}/${this.day}/${this.year}`;
   }
}
