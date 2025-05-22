import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WindowSimulation from './components/WindowSimulation';
import MessageSimulation from './components/MessageSimulation';
import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-blue-400 hover:text-blue-300">Window Simulation</Link>
              </li>
              <li>
                <Link to="/message" className="text-blue-400 hover:text-blue-300">Message Simulation</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<WindowSimulation />} />
            <Route path="/message" element={<MessageSimulation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}