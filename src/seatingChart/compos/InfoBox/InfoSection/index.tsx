const InfoSection: React.FC<{
   header: string;
   children: React.ReactNode;
}> = ({ children, header }) => {
   return (
      <>
         <div className="section">
            <div className="absolute">
               <div className="header">{header}</div>
               <div className="vert-line" />
            </div>
            <div className="content">{children}</div>
         </div>
      </>
   );
};

export default InfoSection;
