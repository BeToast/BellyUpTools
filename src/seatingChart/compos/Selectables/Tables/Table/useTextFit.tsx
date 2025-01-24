import { useSelected } from "../../../../context/SelectedContext";
import { useEffect, useRef } from "react";

export const useTextFit = () => {
   const { tableMinStatues } = useSelected();

   const textRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      scaleText();
      window.addEventListener("resize", scaleText);
      return () => window.removeEventListener("resize", scaleText);
   }, []);

   useEffect(() => {
      scaleText();
   }, [tableMinStatues]);

   const scaleText = () => {
      const text = textRef.current;
      const container = containerRef.current;
      if (!text || !container) return;

      text.style.fontSize = "100px";

      const scale = Math.min(
         container.offsetWidth / text.offsetWidth,
         container.offsetHeight / text.offsetHeight
      );

      const fontSize = scale * 50;
      text.style.fontSize = `${fontSize}px`;
      console.log(scale);
      console.log(fontSize);
   };

   return [textRef, containerRef] as const;
};
