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

   var earliestPresaleDate: Date;
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
      earliestPresaleDate = json
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

   // Track running totals for GA and Res
   let runningGaTotal = 0;
   let runningResTotal = 0;
   let gaSoldOutDate: Date | null = null;
   let resSoldOutDate: Date | null = null;

   // Sort the data by date
   const sortedData = [...json].sort(
      (a, b) =>
         excelSerialDateToJSDate(a.Completed).getTime() -
         excelSerialDateToJSDate(b.Completed).getTime()
   );

   // Find sold out dates by accumulating totals
   for (const row of sortedData) {
      const qty = parseInt(row.QTY?.toString() ?? "0", 10) || 0;

      if (row["Ticket Type"] === "General Admission") {
         runningGaTotal += qty;
         if (runningGaTotal >= 370 && !gaSoldOutDate) {
            gaSoldOutDate = excelSerialDateToJSDate(row.Completed);
         }
      } else if (row["Ticket Type"] === "Reserved") {
         runningResTotal += qty;
         if (runningResTotal >= 80 && !resSoldOutDate) {
            resSoldOutDate = excelSerialDateToJSDate(row.Completed);
         }
      }
   }

   const gaSoldOutLine = gaSoldOutDate
      ? `GA sold out (${
           gaSoldOutDate.getMonth() + 1
        }/${gaSoldOutDate.getDate()})`
      : null;

   const resSoldOutLine = resSoldOutDate
      ? `RES sold out (${
           resSoldOutDate.getMonth() + 1
        }/${resSoldOutDate.getDate()})`
      : null;

   const eventNameDateLine = `${eventName} - ${eventDate.toDateString()}`;
   const totalLine = `Total - ${total} (${totalGa}ga, ${totalRes}res)`;
   const presaleLine = `${
      hadPresale
         ? `Presale(${
              earliestPresaleDate!.getMonth() + 1
           }/${earliestPresaleDate!.getDate()}) - ${presale} (${presaleGa}ga, ${presaleRes}res)`
         : "there was no presale"
   }`;
   const firstDayPublicLine = `1st day public - ${firstDayPublic} (${firstDayPublicGa}ga, ${firstDayPublicRes}res)`;
   const dosLine = `DOS - ${dos} (${dosGa}ga, ${dosRes}res)`;
   const privateLine = `Private - ${private_} (${privateGa}ga, ${privateRes}res)`;

   return `${eventNameDateLine}
${totalLine}
${presaleLine}
${firstDayPublicLine}
${
   gaSoldOutDate && resSoldOutDate
      ? gaSoldOutDate < resSoldOutDate
         ? `${gaSoldOutLine}\n${resSoldOutLine}\n`
         : `${resSoldOutLine}\n${gaSoldOutLine}\n`
      : gaSoldOutLine
      ? `${gaSoldOutLine}\n`
      : resSoldOutLine
      ? `${resSoldOutLine}\n`
      : ""
}${dosLine}
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
