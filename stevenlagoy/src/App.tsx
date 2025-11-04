import './App.scss';
import type { ReactNode } from 'react';
import Header from '@components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "@pages/HomePage";
import TwochrePage from '@pages/TwochrePage/TwochrePage';

const Layout = ({ children }: { children: ReactNode }) => (
  <div>
    <Header />
    <main>
      { children }
    </main>
  </div>
);

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/twochre" element={<TwochrePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
