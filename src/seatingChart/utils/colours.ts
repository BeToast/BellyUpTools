// THIS FILE IS MODIFIED TO ONLY USE GREY COLOURS

// var colours: Array<string> = [
//    "#dc906a",
//    "#ec24ec",
//    "#46cb2a",
//    "#c145f1",
//    "#52c854",
//    "#db49dc",
//    "#6ab734",
//    "#b061ec",
//    "#9fc431",
//    "#766bec",
//    "#b5b52f",
//    "#6f80ea",
//    "#eb6817",
//    "#2cbee4",
//    "#ed4121",
//    "#34c982",
//    "#ec2c68",
//    "#359c3d",
//    "#d264ca",
//    "#74bd64",
//    "#b079e4",
//    "#98b24e",
//    "#e45096",
//    "#489149",
//    "#ea434c",
//    "#40c4ae",
//    "#e35970",
//    "#369d6e",
//    "#dc7fcb",
//    "#60943d",
//    "#b89be1",
//    "#d3a43b",
//    "#5894da",
//    "#db8a31",
//    "#6fc387",
//    "#e989b4",
//    "#888c30",
//    "#c46482",
//    "#a0c379",
//    "#d96939",
//    "#62a374",
//    "#d87165",
// ];

const grey: string = "ffffff";

const getColour: () => string = () => {
   // const colour = colours.shift()!;
   // return colour;
   return grey;
};

const readLastColour: () => string = () => {
   // return colours[colours.length - 1];
   return grey;
};

const returnColour: (colour: string) => void = (colour: string) => {
   // colours.push(colour);
   // console.log(colours.length);
};

export { getColour, readLastColour, returnColour };
