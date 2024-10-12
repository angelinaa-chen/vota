import logo from './logo.svg';
import './App.css';
// import "@fontsource/sarabun";
import "@fontsource/sarabun/200.css";
import "@fontsource/sarabun/500.css";
import "@fontsource/sarabun/700.css";
import votingImage from './images/voting_2.png';
// import "@fontsource/sarabun/700.css";

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';

function Home() {
  const [location, setLocatoin] = useState('');
  const navigate = useNavigate();

  const submitAction = (e) => {
    e.preventDefault();
    navigate(`/location/${location}`)
  };

  return (
    <div style = {{ textAlign: 'left', padding: '100px', fontFamily: 'sarabun'}}>

      <div style={{ textAlign: 'left', flex: '1' }}>
        {/* Heading & Title Section */}
        <h1 style = {{ color: '#2F2E41', fontSize: '35pt', marginBottom: '-30px', fontWeight: '700', marginTop: '100px'}}> Welcome to </h1>
        <h1 style = {{ color: '#2F2E41', fontSize: '45pt', fontWeight: '700'}}> CivicConnect! <span style = {{color: '#4C63FF', fontSize: '25pt', marginLeft: '20px'}} > One vote, one voice. </span> </h1>
        <p style={{ maxWidth: '700px', color: '#555555', fontSize: '20px', fontWeight: '500', marginTop: '50px', lineHeight: '1.5' }}>
          Voting is one of the most important ways to express your voice and influence the future of your community. Through the power of voting, let's empower civic engagement and strengthen our democracy!
        </p>
        {/* <span style = {{color: '#4C63FF'}} > CivicConnect! </span> */}
      </div>

      {/* Adds the image. */}
      <div style={{ flex: '1', textAlign: 'right' }}>
        <img src = {votingImage} alt = "voting_image" style = {{ maxWidth: '50%', marginTop: '-400px', marginLeft: '750px'}} />
      </div>
    </div>
  );
}

// function Welcome() {
//   const { name } = useParams();
//   return (
//     <div style = {{ textAlign: 'center', marginTop: '50px' }}>
//       <h1> Welcome, {name}! </h1>
//     </div>
//   );
// }

function Location() {
  const { location } = useParams();
  return (
    <div style = {{ textAlign: 'center', marginTop: '50px', fontFamily: 'sarabun' }}>
      <h1> Location: {location} </h1>
      <p> Discover your elected representative and access pertinent voting resources! </p>
    </div>
  )
}

function App() {
  return (
    <div style = {{ backgroundColor: '#F0F4FC', minHeight: '100vh'}}>
      <Router>
        <Routes>
          <Route path = "/" element = { <Home />} />
          <Route path = "/location/:location" element = { <Location />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;