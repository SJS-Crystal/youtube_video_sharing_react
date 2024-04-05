import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ErrorMessage from './components/ErrorMessage';
import Timeline from './pages/Timeline';
import ShareVideo from './pages/ShareVideo';
import './assets/css/App.css';

function App() {
  const [errorMessage, setErrorMessage] = useState<any>(null);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <>
      <Header setErrorMessage={setErrorMessage} />
      <ErrorMessage message={errorMessage} />
      <Routes>
        <Route path="/" element={<Timeline/>} />
        <Route path="/share" element={<ShareVideo setErrorMessage={setErrorMessage} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
