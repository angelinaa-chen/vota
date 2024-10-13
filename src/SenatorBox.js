import React from 'react';

const SenatorBox = ({ member }) => {
  const { name, partyName, state, depiction, terms } = member;
  
  return (
    <div style={boxStyle}>
      <img src={depiction.imageUrl} alt={`${name}`} style={imageStyle} />
      <div style={infoStyle}>
        <h3>{name}</h3>
        <p><strong>Party:</strong> {partyName}</p>
        <p><strong>State:</strong> {state}</p>
        <p><strong>Chamber:</strong> {terms.item[0].chamber}</p>
        <p><strong>Start Year:</strong> {terms.item[0].startYear}</p>
      </div>
    </div>
  );
};

// Example styles for the Senator box
const boxStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '20px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  marginBottom: '20px',
};

const imageStyle = {
  width: '100px',
  height: 'auto',
  borderRadius: '50%',
};

const infoStyle = {
  display: 'flex',
  flexDirection: 'column',
};

export default SenatorBox;
