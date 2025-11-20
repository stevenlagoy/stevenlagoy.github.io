import './App.scss';
import { type ReactNode } from 'react';
import Header from '@components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "@pages/HomePage";
import TwochrePage from '@pages/TwochrePage/TwochrePage';
import FractalPage from '@pages/FractalPage';

const Layout = ({ children }: { children: ReactNode }) => {    
  
  return (
    <>
      <Header />
      <main>
        { children }
      </main>
    </>
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
