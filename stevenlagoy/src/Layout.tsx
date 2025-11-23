import styles from "./Layout.module.scss";

import { type ReactNode } from 'react';
import Fractal from "./components/Fractal";
import Header from "./components/Header";

export const Layout = ({ children }: { children: ReactNode }) => {    
  return (
    <>
      <Fractal />
      <Header />
      <div className={styles.content}>
        {children}
      </div>
    </>
  );
};