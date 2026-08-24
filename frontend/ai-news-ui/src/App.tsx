import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from '@/components/Layout/Layout.tsx';

import {
  DetailedNewsPage,
  OverviewPage,
  RiskMapPage,
  NotFoundPage,
  NetworkLabPage,
  MediaBiasPage,
  NewsPage
} from '@/pages';


const App = () => {
  return (
    <MantineProvider>
      <Notifications />
      <Router>
        <Layout>
          <Routes>
            <Route path='/' element={<OverviewPage />} />
            <Route path='/network_lab' element={<NetworkLabPage />} />
            <Route path='/media_bias' element={<MediaBiasPage />} />
            <Route path='/risk_map' element={<RiskMapPage />} />
            <Route path='/detailed_news' element={<DetailedNewsPage />} />
            <Route path='/news' element={<NewsPage />} />
            <Route path='/news/:Id' element={<DetailedNewsPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </MantineProvider>
  );
};

export default App;
