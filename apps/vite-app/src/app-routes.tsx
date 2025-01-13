import { HashRouter, Route, Routes } from 'react-router-dom';

import ChainIdLayout from './routes/chain-id';
import HatIdLayout from './routes/hat-id';
import App from './App';

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
