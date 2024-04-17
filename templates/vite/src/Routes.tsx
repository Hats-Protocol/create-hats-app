import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ChainIdLayout from './routes/chain-id';
import HatIdLayout from './routes/hat-id';

const AppRoutes = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:chainId" element={<ChainIdLayout />} />
        <Route path="/:chainId/:hatId" element={<HatIdLayout />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;
