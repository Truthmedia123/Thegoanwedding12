import React from 'react';
import './TestCSS.css';

export default function TestCSS() {
  return (
    <div className="test-container">
      <h1 className="test-heading">CSS Test</h1>
      <p className="test-paragraph">If you can see this text with styling, CSS is working correctly!</p>
      <div className="test-box">This is a test box</div>
    </div>
  );
}