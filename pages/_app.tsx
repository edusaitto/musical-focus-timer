import React, { ElementType } from "react";
import "../styles/globals.css";

interface IApp {
  Component: ElementType;
  pageProps: any;
}

function App({ Component, pageProps }: IApp) {
  return <Component {...pageProps} />;
}

export default App;
