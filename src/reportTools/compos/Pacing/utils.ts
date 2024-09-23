export const calculateSalesPacing = (
   json: any[],
   eventName: string,
   eventDate: Date
): string => {
   const totalGa = json
      .filter((row) => row["Ticket Type"] === "General Admission")
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );
   const totalRes = json
      .filter((row) => row["Ticket Type"] === "Reserved")
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );
   const total = totalGa + totalRes;

   const hadPresale: boolean = json.some((row) => row.Source === "Presale");
   var presaleGa: number = 0;
   var presaleRes: number = 0;
   var presale: number = 0;

   var firstDayPublicDate: Date;

   if (hadPresale) {
      presaleGa = json
         .filter(
            (row) =>
               row.Source === "Presale" &&
               row["Ticket Type"] === "General Admission"
         )
         .reduce(
            (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
            0
         );
      presaleRes = json
         .filter(
            (row) =>
               row.Source === "Presale" && row["Ticket Type"] === "Reserved"
         )
         .reduce(
            (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
            0
         );
      presale = presaleGa + presaleRes;

      // Find the earliest presale date
      const earliestPresaleDate: Date = json
         .filter((row) => row.Source === "Presale")
         .reduce((earliest, current) => {
            const currentDate = excelSerialDateToJSDate(current.Completed);
            return earliest === null || currentDate < earliest
               ? currentDate
               : earliest;
         }, null as Date | null);

      // Calculate first day public (one day after earliest presale)
      firstDayPublicDate = new Date(earliestPresaleDate.getTime() + 86400000); // 86400000 ms = 1 day
   } else {
      firstDayPublicDate = json
         .filter((row) => row.Source === "_Public")
         .reduce((earliest, current) => {
            const currentDate = excelSerialDateToJSDate(current.Completed);
            return earliest === null || currentDate < earliest
               ? currentDate
               : earliest;
         }, null as Date | null);
   }

   const firstDayPublicGa = json
      .filter((row) => {
         return (
            areEqualByComponents(
               excelSerialDateToJSDate(row.Completed),
               firstDayPublicDate
            ) &&
            row.Source === "_Public" &&
            row["Ticket Type"] === "General Admission"
         );
      })
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   const firstDayPublicRes = json
      .filter((row) => {
         return (
            areEqualByComponents(
               excelSerialDateToJSDate(row.Completed),
               firstDayPublicDate
            ) &&
            row.Source === "_Public" &&
            row["Ticket Type"] === "Reserved"
         );
      })
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   const firstDayPublic = firstDayPublicGa + firstDayPublicRes;

   // Calculate DOS (Day of Show) based on the event date in the file name

   const dosGa = json
      .filter((row) => {
         return (
            areEqualByComponents(
               excelSerialDateToJSDate(row.Completed),
               eventDate
            ) && row["Ticket Type"] === "General Admission"
         );
      })
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   const dosRes = json
      .filter((row) => {
         return (
            areEqualByComponents(
               excelSerialDateToJSDate(row.Completed),
               eventDate
            ) && row["Ticket Type"] === "Reserved"
         );
      })
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   const dos = dosGa + dosRes;

   const privateGa = json
      .filter(
         (row) =>
            row.Source === "Private_Purchase" &&
            row["Ticket Type"] === "General Admission"
      )
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );
   const privateRes = json
      .filter(
         (row) =>
            row.Source === "Private_Purchase" &&
            row["Ticket Type"] === "Reserved"
      )
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   const private_ = privateGa + privateRes;

   return `${eventName}, ${eventDate.toDateString()}
Total: ${total} (ga ${totalGa}, res ${totalRes})
Presale: ${
      hadPresale
         ? `${presale} (ga ${presaleGa}, res ${presaleRes})`
         : "there was no presale"
   }
1st day public: ${firstDayPublic} (ga ${firstDayPublicGa}, res ${firstDayPublicRes})
DOS: ${dos} (ga ${dosGa}, res ${dosRes})
Private: ${private_} (ga ${privateGa}, res ${privateRes})`;
};

// const dateRegex = /(\d{2})-(\d{2})-(\d{4})/;
// export const dateFromString = (completed: string): Date => {
//    if (!completed) return new Date();

//    const match = completed.match(dateRegex);
//    if (match) {
//       const [, month, day, year] = match.map((n) => parseInt(n, 10));
//       // Note: month is 0-indexed in JavaScript Date object
//       return new Date(year, month - 1, day);
//    } else {
//       return new Date();
//       // throw new Error("Invalid completed: string");
//    }
// };

const areEqualByComponents = (date1: Date, date2: Date): boolean => {
   return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
   );
};

function excelSerialDateToJSDate(serial: number): Date {
   const utc_days = Math.floor(serial - 25568);
   const utc_value = utc_days * 86400;
   const date_info = new Date(utc_value * 1000);

   // const fractional_day = serial - Math.floor(serial) + 0.0000001;

   // let total_seconds = Math.floor(86400 * fractional_day);

   // const seconds = total_seconds % 60;
   // total_seconds -= seconds;

   // const hours = Math.floor(total_seconds / (60 * 60));
   // const minutes = Math.floor(total_seconds / 60) % 60;

   return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate()
      // hours,
      // minutes,
      // seconds
   );
}
