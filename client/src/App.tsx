import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import HistoryPage from './components/History/HistoryPage';
import { NetworkHistoryProvider } from './context/NetworkHistoryContext';

function App() {
  return (
    <BrowserRouter>
      <NetworkHistoryProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </NetworkHistoryProvider>
    </BrowserRouter>
  );
}

export default App;
