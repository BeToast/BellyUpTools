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

   const waitlistGa = json
      .filter(
         (row) =>
            row.Source === "Hold_Bank" &&
            row["Ticket Type"] === "General Admission"
      )
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );
   const waitlistRes = json
      .filter(
         (row) =>
            row.Source === "Hold_Bank" && row["Ticket Type"] === "Reserved"
      )
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   const waitlist = waitlistGa + waitlistRes;

   // New code to check for "Hold Bank" and find the last public sale date
   const hasHoldBank = json.some((row) => row.Source === "Hold_Bank");
   let soldOutDate: Date | null = null;

   if (hasHoldBank) {
      const lastPublicSaleDate = json
         .filter((row) => row.Source === "_Public")
         .reduce((latest, current) => {
            const currentDate = excelSerialDateToJSDate(current.Completed);
            return latest === null || currentDate > latest
               ? currentDate
               : latest;
         }, null as Date | null);
      if (lastPublicSaleDate) {
         soldOutDate = lastPublicSaleDate;
      }
   }

   const eventNameDateLine = `${eventName} - ${eventDate.toDateString()}`;
   const totalLine = `Total: ${total} (ga ${totalGa}, res ${totalRes})`;
   const presaleLine = `Presale: ${
      hadPresale
         ? `${presale} (ga ${presaleGa}, res ${presaleRes})`
         : "there was no presale"
   }`;
   const firstDayPublicLine = `1st day public: ${firstDayPublic} (ga ${firstDayPublicGa}, res ${firstDayPublicRes})`;
   const dosLine = `DOS: ${dos} (ga ${dosGa}, res ${dosRes})`;
   const soldOutLine: string | null = soldOutDate
      ? `Show sold out - ${soldOutDate.toDateString()}\nWaitlist: ${waitlist} (ga ${waitlistGa}, res ${waitlistRes})`
      : null;
   const privateLine = `Private: ${private_} (ga ${privateGa}, res ${privateRes})`;

   return `${eventNameDateLine}
${totalLine}
${presaleLine}
${firstDayPublicLine}
${
   soldOutDate
      ? soldOutDate < eventDate
         ? `${soldOutLine}\n${dosLine}`
         : `${dosLine}\n${soldOutLine}`
      : dosLine
}
${privateLine}
`;
};

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

   return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate()
   );
}
