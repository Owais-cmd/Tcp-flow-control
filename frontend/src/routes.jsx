// src/App.jsx or src/routes.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import MessageSimulator from './components/MessageSimulator';

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/message" element={<MessageSimulator />} />
      </Routes>
    </Router>
  );
}

export default MainApp;
