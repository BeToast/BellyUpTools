// export const addChartToUrl = (chartKey: string) => {
//    const newUrl = `https://bellyuptools.web.app/seatingChart/?chart=${encodeURIComponent(
//       chartKey
//    )}`;
//    window.history.pushState({}, "", newUrl);

// };
export const addChartToUrl = (docKey: string) => {
   const newUrl = new URL(window.location.href);
   newUrl.searchParams.set("chart", docKey);
   window.history.pushState(null, "", newUrl.toString());
};

export const getChartIdFromUrl = (): string | null => {
   const urlParams = new URLSearchParams(window.location.search);
   return urlParams.get("chart");
};
