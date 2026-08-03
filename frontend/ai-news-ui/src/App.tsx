import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from '@/components/Layout/Layout.tsx';

import {
  DetailedNewsPage,
  OverviewPage,
  DiscoveryPage,
  NotFoundPage,
  NetworkLabPage,
  MediaBiasPage
} from '@/pages';

import {
  GlobalIntervalProvider
} from '@/shared/providers';

const App = () => {
  return (
    <MantineProvider>
      <Router>
        <Layout>
          <Routes>
            <Route
              path='/'
              element={
                <GlobalIntervalProvider>
                  <OverviewPage />
                </GlobalIntervalProvider>
              }
            />
            <Route
              path='/network_lab'
              element={
                <GlobalIntervalProvider>
                  <NetworkLabPage />
                </GlobalIntervalProvider>
              }
            />
            <Route
              path='/media_bias'
              element={
                <GlobalIntervalProvider>
                  <MediaBiasPage />
                </GlobalIntervalProvider>
              }
            />
            <Route
              path='/discovery'
              element={
                <GlobalIntervalProvider>
                  <DiscoveryPage />
                </GlobalIntervalProvider>
              }
            />
            <Route path='/news' element={<DetailedNewsPage />} />
            <Route path='/news/:link' element={<DetailedNewsPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </MantineProvider>
  );
};

export default App;
