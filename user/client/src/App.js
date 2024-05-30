import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Home /> </PrivateRoute>} />
          <Route path="/about" element={<PrivateRoute><About /> </PrivateRoute>} />
          <Route path="/contact" element={<PrivateRoute><Contact /> </PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
