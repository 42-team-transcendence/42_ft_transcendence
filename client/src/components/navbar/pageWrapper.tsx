import React, { ReactNode, useState } from 'react';
import Navbar from '../navbar/Navbar';

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const [showLinks, setShowLinks] = useState(false);

  const handleShowLinks = () => {
    setShowLinks((prevShowLinks) => !prevShowLinks);
  };

  return (
    <>
      <Navbar showLinks={showLinks} handleShowLinks={handleShowLinks} />
      {children}
    </>
  );
};

export default PageWrapper;

