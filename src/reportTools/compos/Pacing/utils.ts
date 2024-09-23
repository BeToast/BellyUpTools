import { MyDate } from "../../MyDate";

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

   const presaleGa = json
      .filter(
         (row) =>
            row.Source === "Presale" &&
            row["Ticket Type"] === "General Admission"
      )
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );
   const presaleRes = json
      .filter(
         (row) => row.Source === "Presale" && row["Ticket Type"] === "Reserved"
      )
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );
   const presale = presaleGa + presaleRes;

   console.log(json[1].Completed);
   console.log(new Date(json[1].Completed));
   const bongus = json
      .filter((row) => row.Source === "Presale")
      .map((row) => new MyDate(row.Completed));
   console.log(bongus[0]);

   // Find the earliest presale date
   const presaleDates = json
      .filter((row) => row.Source === "Presale")
      .map((row) => new Date(row.Completed).getTime());
   const earliestPresaleDate = new Date(Math.min(...presaleDates));

   // Calculate first day public (one day after earliest presale)
   const firstDayPublicDate = new Date(earliestPresaleDate);
   firstDayPublicDate.setDate(firstDayPublicDate.getDate() + 1);

   const firstDayPublicGa = json
      .filter((row) => {
         const completedDate = new Date(row.Completed);
         return (
            completedDate.toDateString() ===
               firstDayPublicDate.toDateString() &&
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
         const completedDate = new Date(row.Completed);
         return (
            completedDate.toDateString() ===
               firstDayPublicDate.toDateString() &&
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
   // console.log(eventDate);

   const dosGa = json
      .filter((row) => {
         const completedDate = new Date(row.Completed);
         // console.log(new Date(row.Completed).toDateString());
         // console.log(completedDate);
         return (
            completedDate.toDateString() === eventDate.toDateString() &&
            row["Ticket Type"] === "General Admission"
         );
      })
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   const dosRes = json
      .filter((row) => {
         const completedDate = new Date(row.Completed);
         return (
            completedDate.toDateString() === eventDate.toDateString() &&
            row["Ticket Type"] === "Reserved"
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
Presale: ${presale} (ga ${presaleGa}, res ${presaleRes})
1st day public: ${firstDayPublic} (ga ${firstDayPublicGa}, res ${firstDayPublicRes})
DOS: ${dos} (ga ${dosGa}, res ${dosRes})
Private: ${private_} (ga ${privateGa}, res ${privateRes})`;
};
