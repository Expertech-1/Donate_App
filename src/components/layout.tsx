import React from "react";
import Header from "./header";
import Footer from "./footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: RootLayoutProps) {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-screen-2xl px-6 py-6 sm:px-6 sm:py-4 lg:py-6">
        {children}
      </div>
      <Footer />
    </>
  );
}
