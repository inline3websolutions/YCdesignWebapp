import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import Sales from './pages/Sales';
import SaleDetail from './pages/SaleDetail';
import Loader from './components/Loader';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <HashRouter>
      <ScrollToTop />
      
      {!isLoaded ? (
        <Loader onComplete={() => setIsLoaded(true)} />
      ) : (
        <Layout>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/:id" element={<SaleDetail />} />
            </Routes>
        </Layout>
      )}
    </HashRouter>
  );
};

export default App;