import './App.scss';
import { useEffect, type ReactNode } from 'react';
import Header from '@components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "@pages/HomePage";
import TwochrePage from '@pages/TwochrePage/TwochrePage';
import FractalPage from '@pages/FractalPage';

const Layout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const updateMargin = () => {
      if (header && main) {
        main.style.marginTop = `${header.getBoundingClientRect().height}px`;
      }
    };
    updateMargin();
    window.addEventListener("scroll", updateMargin);
    window.addEventListener("resize", updateMargin);
    return () => {
      window.removeEventListener("scroll", updateMargin);
      window.removeEventListener("resize", updateMargin);
    };
  }, []);
  
  return (
    <div>
      {/* <Header /> */}
      <main>
        { children }
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/twochre" element={<TwochrePage />} />
          <Route path="/fractal" element={<FractalPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
