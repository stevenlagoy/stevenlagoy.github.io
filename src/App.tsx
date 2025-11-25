import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import HomePage from "@pages/HomePage";
import TwochrePage from '@pages/TwochrePage/TwochrePage';
import FractalPage from '@pages/FractalPage';

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
