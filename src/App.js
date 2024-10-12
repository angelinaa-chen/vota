import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';

function Home() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const submitAction = (e) => {
    e.preventDefault();
    navigate(`/welcome/${name}`)
  };

  return (
    <div style = {{ textAlign: 'center', marginTop: '50px' }}>
      <h1> Input Name: </h1>
      <form onSubmit = {submitAction} >
        <input
          type = "text"
          value = {name}
          onChange = { (e) => setName(e.target.value)}
          placeholder = "Enter your name"
          style = {{ padding: '10px', fontSize: '16px' }}
        />
        <button type = "submit" style = {{ marginLeft: '10px', padding: '10px 20px' }}> Submit </button>
      </form>
    </div>
  );
}

function Welcome() {
  const { name } = useParams();
  return (
    <div style = {{ textAlign: 'center', marginTop: '50px' }}>
      <h1> Welcome, {name}! </h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = { <Home />} />
        <Route path = "/welcome/:name" element = { <Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;