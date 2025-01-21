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
   const totalVip = json
      .filter((row) => row["Ticket Type"]?.includes("VIP"))
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );
   const total = totalGa + totalRes + totalVip;

   const hadPresale: boolean = json.some((row) => row.Source === "Presale");
   var presaleGa: number = 0;
   var presaleRes: number = 0;
   var presaleVip: number = 0;
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
      presaleVip = json
         .filter(
            (row) =>
               row.Source === "Presale" && row?.["Ticket Type"]?.includes("VIP")
         )
         .reduce(
            (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
            0
         );
      presale = presaleGa + presaleRes + presaleVip;

      earliestPresaleDate = json
         .filter((row) => row.Source === "Presale")
         .reduce((earliest, current) => {
            const currentDate = excelSerialDateToJSDate(current.Completed);
            return earliest === null || currentDate < earliest
               ? currentDate
               : earliest;
         }, null as Date | null);

      firstDayPublicDate = new Date(earliestPresaleDate.getTime() + 86400000);
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

   const firstDayPublicVip = json
      .filter((row) => {
         return (
            areEqualByComponents(
               excelSerialDateToJSDate(row.Completed),
               firstDayPublicDate
            ) &&
            row.Source === "_Public" &&
            row?.["Ticket Type"]?.includes("VIP")
         );
      })
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   const firstDayPublic =
      firstDayPublicGa + firstDayPublicRes + firstDayPublicVip;

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

   const dosVip = json
      .filter((row) => {
         return (
            areEqualByComponents(
               excelSerialDateToJSDate(row.Completed),
               eventDate
            ) && row?.["Ticket Type"]?.includes("VIP")
         );
      })
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   const dos = dosGa + dosRes + dosVip;

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
   const privateVip = json
      .filter(
         (row) =>
            row.Source === "Private_Purchase" &&
            row?.["Ticket Type"]?.includes("VIP")
      )
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   const private_ = privateGa + privateRes + privateVip;

   let runningGaTotal = 0;
   let runningResTotal = 0;
   let runningVipTotal = 0;
   let gaSoldOutDate: Date | null = null;
   let resSoldOutDate: Date | null = null;
   let vipSoldOutDate: Date | null = null;

   const sortedData = [...json].sort(
      (a, b) =>
         excelSerialDateToJSDate(a.Completed).getTime() -
         excelSerialDateToJSDate(b.Completed).getTime()
   );

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
      } else if (row?.["Ticket Type"]?.includes("VIP")) {
         runningVipTotal += qty;
         if (runningVipTotal >= 50 && !vipSoldOutDate) {
            vipSoldOutDate = excelSerialDateToJSDate(row.Completed);
         }
      }
   }

   const getPriceAndFees = (type: string) => {
      const ticket = json.find((row) =>
         type === "VIP"
            ? row["Ticket Type"]?.includes(type)
            : row["Ticket Type"] === type
      );
      if (!ticket) return null;
      const qty = parseInt(ticket.QTY?.toString() ?? "1", 10) || 1;
      return {
         price: parseFloat(ticket["Face Value"]?.toString() || "0") / qty,
         fees: parseFloat(ticket["Fees"]?.toString() || "0") / qty,
      };
   };

   const gaPrice = getPriceAndFees("General Admission");
   const resPrice = getPriceAndFees("Reserved");
   const vipPrice = getPriceAndFees("VIP");

   const formatTicketCount = (
      total: number,
      ga: number,
      res: number,
      vip: number
   ) => {
      if (total === 0) return "0";
      const parts = [];
      if (ga > 0) parts.push(`${ga}ga`);
      if (res > 0) parts.push(`${res}res`);
      if (vip > 0) parts.push(`${vip}vip`);
      return `${total} (${parts.join(", ")})`;
   };

   const soldOutDates = [
      ...(gaSoldOutDate
         ? [
              {
                 date: gaSoldOutDate,
                 line: `GA sold out (${
                    gaSoldOutDate.getMonth() + 1
                 }/${gaSoldOutDate.getDate()})`,
              },
           ]
         : []),
      ...(resSoldOutDate
         ? [
              {
                 date: resSoldOutDate,
                 line: `RES sold out (${
                    resSoldOutDate.getMonth() + 1
                 }/${resSoldOutDate.getDate()})`,
              },
           ]
         : []),
      ...(vipSoldOutDate
         ? [
              {
                 date: vipSoldOutDate,
                 line: `VIP sold out (${
                    vipSoldOutDate.getMonth() + 1
                 }/${vipSoldOutDate.getDate()})`,
              },
           ]
         : []),
   ]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ line }) => line)
      .join("\n");

   return `${eventName} - ${eventDate.toDateString()}
      Prices: ga($${gaPrice?.price}, $${gaPrice?.fees}) res($${
      resPrice?.price
   }, $${resPrice?.fees}) vip($${vipPrice?.price}, $${vipPrice?.fees})
      Total - ${formatTicketCount(total, totalGa, totalRes, totalVip)}
      ${
         hadPresale
            ? `Presale(${
                 earliestPresaleDate!.getMonth() + 1
              }/${earliestPresaleDate!.getDate()}) - ${formatTicketCount(
                 presale,
                 presaleGa,
                 presaleRes,
                 presaleVip
              )}`
            : "there was no presale"
      }
      1st day public - ${formatTicketCount(
         firstDayPublic,
         firstDayPublicGa,
         firstDayPublicRes,
         firstDayPublicVip
      )}${soldOutDates ? `\n${soldOutDates}` : ""}${
      dos > 0 ? `\nDOS - ${formatTicketCount(dos, dosGa, dosRes, dosVip)}` : ""
   }${
      private_ > 0
         ? `\nPrivate - ${formatTicketCount(
              private_,
              privateGa,
              privateRes,
              privateVip
           )}`
         : ""
   }`
      .split("\n")
      .map((line) => line.trimStart())
      .join("\n");
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
