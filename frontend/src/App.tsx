import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Cover } from './pages/Cover';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { Chat } from './pages/Chat';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/cover" replace />} />
          <Route path="/cover" element={<Cover />} />
          <Route path="/home" element={<Home />} />
          <Route path="/detail/:category" element={<Detail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/cover" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
