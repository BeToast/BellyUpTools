const InfoSection: React.FC<{
   header: string;
   className?: string;
   contentClass?: string;
   children: React.ReactNode;
}> = ({ children, header, className = "", contentClass = "" }) => {
   return (
      <>
         <div className={`section ${className}`}>
            <div className="absolute">
               <div className="header">{header}</div>
               <div className="vert-line" />
            </div>
            <div className={`content ${contentClass}`}>{children}</div>
         </div>
      </>
   );
};

export default InfoSection;
