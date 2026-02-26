import React from "react";
import Left from "./Left";
import Top from "./Top";

const Layout = () => {
  return (
    <>
      <div className="min-h-screen relative">
        <Left />
        <Top />
      </div>
    </>
  );
};

export default Layout;
