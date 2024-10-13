import './App.css';
import "@fontsource/sarabun/200.css";
import "@fontsource/sarabun/500.css";
import "@fontsource/sarabun/600.css";
import "@fontsource/sarabun/700.css";
import votingImage from './images/voting_2.png';
import { useEffect, useRef } from 'react';

// Chatbot imports
import Chatbot from "react-chatbot-kit";
import ChatBotConfig from './ChatBotConfig.js';
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import './ChatBotStyles.css';
// import "react-chatbot-kit/build/main.css";

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';

function Home() {
  const [location, setLocation] = useState('');
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const slideInElements = useRef([]);

  const submitAction = (e) => {
    e.preventDefault();
    navigate(`/location/${location}`)
    window.scrollTo(0, 20);
  };

  {/* Styles for countdown timer boxes. */}
  const boxStyle = {
    backgroundColor: 'white',
    color: '#FF6F61',
    fontSize: '40pt',
    padding: '40px 20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    minWidth: '120px',
    minHeight: '120px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14pt',
    color: '#333333',
    marginTop: '10px',
  };

  useEffect(() => {
    const targetDate = new Date('November 5, 2024 00:00:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setMessage("It's Election day! Go make your vote count!");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.1 }
    );

    slideInElements.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      slideInElements.current.forEach((el) => {
        if (el) {
          observer.unobserve(el);
        }
      });
    };
  }, []);

  return (
    <div style = {{ textAlign: 'left', padding: '100px', fontFamily: 'sarabun'}}>

      {/* Floating Circles */}
      <div className = "floating-circle circle-1"> </div>
      <div className = "floating-circle circle-2"> </div>
      <div className = "floating-circle circle-3"> </div>
      {/* <div className = "floating-circle circle-4"> </div> */}
      <div className = "floating-circle circle-5"> </div>
      <div className = "floating-circle circle-6"> </div>
      <div className = "floating-circle circle-7"> </div>

      {/* Heading & Title Section */}
      <div className = "slide-in" ref = {(el) => slideInElements.current.push(el)} style = {{ textAlign: 'left', flex: '1' }}>
        <h1 style = {{ color: '#2F2E41', fontSize: '35pt', marginBottom: '-30px', fontWeight: '700', marginTop: '100px'}}> Welcome to </h1>
        <h1 style = {{ color: '#2F2E41', fontSize: '45pt', fontWeight: '700'}}> CivicConnect! <span style = {{color: '#4C63FF', fontSize: '25pt', marginLeft: '20px'}} > One vote, one voice. </span> </h1>
        <p style = {{ maxWidth: '700px', color: '#555555', fontSize: '20px', fontWeight: '500', marginTop: '50px', lineHeight: '1.5' }}>
          Voting is one of the most important ways to express your voice and influence the future of your community. Through the power of voting, let's empower civic engagement and strengthen our democracy.
        </p>
      </div>

      {/* Adds the image. */}
      <div className = "slide-in" ref = {(el) => slideInElements.current.push(el)} style = {{ flex: '1', textAlign: 'right', marginBottom: '20px'}}>
        <img src = {votingImage} alt = "voting_image" className = "slide-in slide-in-delay-1" style = {{ maxWidth: '50%', marginTop: '-400px', marginLeft: '750px'}} />
      </div>

      <br></br>

      {/* Countdown to election timer. */}
      <h2 className = "slide-in" ref = {(el) => slideInElements.current.push(el)} style = {{ textAlign: 'center' , fontSize: '30px', color: '#FF6F61', marginBottom: '40px'}}> Time Until Election Day </h2>
      <div className = "slide-in" ref = {(el) => slideInElements.current.push(el)} style = {{ display: 'flex', gap: '20px', margin: '20px 0' , justifyContent: 'center'}}>
        <div style = {boxStyle}>
          {days} <span style = {labelStyle} > Days </span>
        </div>
        <div style={boxStyle}>
          {hours} <span style = {labelStyle}> Hours </span>
        </div>
        <div style = {boxStyle}>
          {minutes} <span style = {labelStyle}> Minutes </span>
        </div>
        <div style = {boxStyle}>
          {seconds} <span style = {labelStyle}> Seconds </span>
        </div>
      </div>
      {message && <p> {message} </p>}

      <br></br>
      <br></br>
      <br></br>

      <p style = {{ color: '#555555', fontSize: '20px', fontWeight: '500', lineHeight: 1.8, textAlign: 'center' }}> Welcome to  
        <strong style = {{ color: '#4C63FF', background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 65%, #d1dbff 65%)' }}> CivicConnect</strong>, 
          your centralized output for voting information! With the 2024 presidental election coming up, CivicConnect is here to provide you with comprehensive 
        <strong> resources, tools, and information </strong>
        to help you 
        <strong style={{ color: '#4C63FF', background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 65%, #d1dbff 65%)' }}> navigate the voting landscape effortlessly
        </strong>. 
        Simply <strong> type in your location </strong>
        to
        <strong style = {{ color: '#4C63FF', background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 65%, #d1dbff 65%)' }}> learn more about the representatives that serve you
        </strong> and about 
        <strong style = {{ color: '#4C63FF', background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 65%, #d1dbff 65%)' }}> voting registration details and deadlines!
        </strong> 
</p>

      

      {/* Timeline of deadline dates. */}
      <br></br>
      <br></br>
      <h2 className = "slide-in" ref = {(el) => slideInElements.current.push(el)} style = {{ marginBottom: '70px' }}> Key upcoming dates and events </h2>
      <div className = "slide-in" ref = {(el) => slideInElements.current.push(el)} style = {{ margin: '40px auto' }}>
        <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span> October 26th </span>
          <span> October 29th </span>
          <span> November 1st </span>
          <span> November 5th </span>
        </div>
        <div style = {{ margin: '20px 0', backgroundColor: '#4C63FF', height: '4px', position: 'relative' }}>
          <div style = {{
            width: '20px',
            height: '20px',
            backgroundColor: '#4C63FF',
            borderRadius: '50%',
            position: 'absolute',
            top: '-8px',
            left: '5%',
          }}> </div>
          <div style = {{
            width: '20px',
            height: '20px',
            backgroundColor: '#4C63FF',
            borderRadius: '50%',
            position: 'absolute',
            top: '-8px',
            left: '35%',
          }}> </div>
          <div style = {{
            width: '20px',
            height: '20px',
            backgroundColor: '#4C63FF',
            borderRadius: '50%',
            position: 'absolute',
            top: '-8px',
            left: '65%',
          }}> </div>
          <div style = {{
            width: '20px',
            height: '20px',
            backgroundColor: '#4C63FF',
            borderRadius: '50%',
            position: 'absolute',
            top: '-8px',
            left: '95%',
          }}> </div>
        </div>

        <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
          <span> Voter Registration Deadline </span>
          <span> Deadline to Request Ballot </span>
          <span> Early Voting Deadline </span>
          <span> Mail and Absentee Deadline </span>
        </div>
      </div>

      {/* Location Section */}
      <br></br>
      <br></br>
      <br></br>
      <h2 className = "slide-in" ref = {(el) => slideInElements.current.push(el)} >Find your local representative. </h2>
      <p className = "slide-in" ref = {(el) => slideInElements.current.push(el)} > Discover your elected representative and access pertinent voting resources! Simply type in your 
      <strong style = {{ color: '#4C63FF', background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 65%, #d1dbff 65%)' }}> city and state name 
      </strong> to get started. </p>
      <form className = "slide-in" ref = {(el) => slideInElements.current.push(el)} onSubmit = {submitAction} style = {{ marginTop: '30px', fontFamily: 'sarabun'}}>
        {/* <label htmlFor = "location" style = {{ fontSize: '18px', color: '#555555' }}> Enter your city and state name in the format "city, state": </label> */}
        <input
          id = "location"
          type = "text"
          value = {location}
          onChange = {(e) => setLocation(e.target.value)}
          placeholder = 'City, State'
          style={{
            // marginLeft: '10px',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '1000px',
            marginRight: '50px'
          }}
        />
        <button type =  "submit" style = {{
          marginLeft: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4C63FF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}> Find your representatives! </button>
      </form>

    </div>
  );
}

const API_KEY = 'U9Xptmv9EgCBbqOUlgwlvwzHz14qn1doLVkkFKjf';

function Location() {
  const slideInElements = useRef([]);
  const { location } = useParams();
  const [houseMembers, setHouseMembers] = useState([]);
  const [senateMembers, setSenateMembers] = useState([]);

  const houseStyle = {
    backgroundColor: 'white',
    padding: '40px 20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    minWidth: '300px',
    minHeight: '400px',
  };

  const senateStyle = {
    backgroundColor: 'white',
    color: '#FF6F61',
    fontSize: '40pt',
    padding: '40px 20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    minWidth: '300px',
    minHeight: '400px',
  };

  useEffect(() => {
    const fetchMemberData = async () => {
      const stateCode = location;
      const url = `https://api.congress.gov/v3/member/${stateCode}?api_key=${API_KEY}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error status: ${response.status}`);
        }
        const data = await response.json();

        const houseMembers = data.members.filter(member =>
          member.terms.item.some(term => term.chamber === 'House of Representatives' && parseInt(term.startYear) > 2015)
        ).sort((a, b) => {
          const aStartYear = parseInt(a.terms.item[0].startYear);
          const bStartYear = parseInt(b.terms.item[0].startYear);
          return bStartYear - aStartYear; // Sort descending (most recent first)
        });;

        const senateMembers = data.members.filter (members =>
          members.terms.item.some(term => term.chamber === "Senate" && parseInt(term.startYear) > 2000)
        );

        setHouseMembers(houseMembers);
        setSenateMembers(senateMembers);
      } catch (error) {
        console.error('Error', error);
      }
    };

    fetchMemberData();

    {/* Sliding in effect when page loads. */}
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    slideInElements.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      slideInElements.current.forEach((el) => {
        if (el) {
          observer.unobserve(el);
        }
      });
    };
  }, [location]);

  const chunkArray = (arr, size) => {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  };

  const houseMemberRows = chunkArray(houseMembers, 3);
  const senateMemberRows = chunkArray(senateMembers, 2);

  return (
    <div className = "slide-in" ref={(el) => slideInElements.current.push(el)} style = {{ textAlign: 'left', padding: '70px', fontFamily: 'sarabun' }}>
      <div style = {{ position: 'absolute', top: '250px', right: '50px', display: 'flex', gap: '50px' }}>
        <img src = {require('./images/senate_logo.png')} alt="US Senate Logo" style = {{ width: '150px', height: '150px' }} />
        <img src = {require('./images/houserep_logo.png')} alt="US House Logo" style = {{ width: '150px', height: '150px' }} />
      </div>
      <h2
        className = "slide-in"
        ref = {(el) => slideInElements.current.push(el)}
        style = {{ fontSize: '35px', marginTop: '150px' }}
      >
        House and Senate Representatives for:
      </h2>
      <h1 className="slide-in" ref={(el) => slideInElements.current.push(el)} style={{ color: '#4C63FF', fontSize: '50pt', fontWeight: '700', marginTop: '70px' }}>
        {location}
      </h1>

      {/* Display member information */}
      <h1 className="slide-in" ref={(el) => slideInElements.current.push(el)} style={{ color: 'black', fontSize: '35pt', fontWeight: '600', marginTop: '200px' }}>
        Representatives
      </h1>

      {/* House representative members. */}
      <h2> House of Representatives </h2>
      {houseMemberRows.map((row, rowIndex) => (
        <div key={rowIndex} className="slide-in" ref={(el) => slideInElements.current.push(el)} style={{ display: 'flex', gap: '50px', margin: '20px 0', justifyContent: 'center' }}>
          {row.map(member => (
            <div key={member.bioguideId} style={{ ...houseStyle, marginTop: '50px' }}>
              {member.depiction && member.depiction.imageUrl ? (
                <img src={member.depiction.imageUrl} alt={member.name} style={{ width: '350px', height: '450px', borderRadius: '10px', marginBottom: '25px'}} />
              ) : (
                <img src={require('./images/senate_logo.png')} alt="Default" style={{ width: '100px', height: '100px', marginBottom: '30px' }} />
              )}
              <strong style = {{ color: '#4C63FF', background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 65%, #d1dbff 65%)', fontSize: '30px'}}>{member.name}</strong>
              <p style = {{ marginTop: '40px', fontSize: '18px'}}> <strong>Party:</strong> {member.partyName}</p>
              <p style = {{ marginTop: '-10px', fontSize: '18px'}}> <strong>District:</strong> {member.district}</p>
              <p style = {{ marginTop: '-15px', fontSize: '18px'}}> <strong>Chamber:</strong> {member.terms.item[0].chamber}</p>
              <p style = {{ marginTop: '-10px', fontSize: '18px'}}> <strong>Start Year:</strong> {member.terms.item[0].startYear}</p>
              <a href={member.url}>More Info</a>
            </div>
          ))}
        </div>
      ))}
      
      <h2> Senators </h2>
      {/* Senate members. */}
      <div className = "slide-in" ref = {(el) => slideInElements.current.push(el)} style = {{ display: 'flex', gap: '50px', margin: '20px 0', justifyContent: 'center'}}>
        {senateMemberRows.map((row, rowIndex) => (
          <div key={rowIndex} className="slide-in" ref={(el) => slideInElements.current.push(el)} style={{ display: 'flex', gap: '20px', margin: '20px 0', justifyContent: 'center' }}>
            {row.map(member => (
              <div key={member.bioguideId} style={{ ...houseStyle, marginTop: '50px' }}>
                {member.depiction && member.depiction.imageUrl ? (
                  <img src={member.depiction.imageUrl} alt={member.name} style={{ width: '400px', height: '500px', borderRadius: '10px' }} />
                ) : (
                  <img src={require('./images/senate_logo.png')} alt="Default" style={{ width: '100px', height: '100px' }} />
                )}
                <h3 style={{ color: '#4C63FF' }}>{member.name}</h3>
                <p> Party: {member.partyName}</p>
                <p> District: {member.district}</p>
                <p> Chamber: {member.terms.item[0].chamber}</p>
                <p> Start Year: {member.terms.item[0].startYear}</p>
                <a href={member.url}>More Info</a>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Display the chatbot */}
      <div style={{ marginTop: '50px' }}>
        <Chatbot
          config={ChatBotConfig}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>

      <h1>More text</h1>
    </div>
  );
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