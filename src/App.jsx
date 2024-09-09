import React, { useEffect } from 'react';
import { Route, Routes, NavLink, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import SelectCiv from './pages/SelectCiv/SelectCiv';
import useStore from './store/store';
import './App.css';
import LearnCounter from './pages/LearnCounter/LearnCounter';

const App = () => {
  const { setActiveTab } = useStore();
  const location = useLocation();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname, setActiveTab]);

  return (
    <div className="app">
      <nav className="nav-bar">
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} 
          end
        >
          Home
        </NavLink>
        <NavLink 
          to="/select-civ" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Select main civ
        </NavLink>
        <NavLink 
          to="/counter-tool" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Counter Tool
        </NavLink>
        <NavLink 
          to="/learn-counter" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Learn counters
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-civ" element={<SelectCiv />} />
        <Route path="/learn-counter" element={<LearnCounter />} />
      </Routes>
    </div>
  );
};

export default App;
