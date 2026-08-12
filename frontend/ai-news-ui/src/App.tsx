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
  MediaBiasPage,
  NewsPage
} from '@/pages';


const App = () => {
  return (
    <MantineProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path='/' element={<OverviewPage />} />
            <Route path='/network_lab' element={<NetworkLabPage />} />
            <Route path='/media_bias' element={<MediaBiasPage />} />
            <Route path='/discovery' element={<DiscoveryPage />} />
            <Route path='/detailed_news' element={<DetailedNewsPage />} />
            <Route path='/news' element={<NewsPage />} />
            <Route path='/news/:link' element={<DetailedNewsPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </MantineProvider>
  );
};

export default App;
