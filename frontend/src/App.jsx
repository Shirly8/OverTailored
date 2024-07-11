import React, { useState, useEffect } from 'react';
import './App.css';

// Latex to HTML conversion:
// import {renderMathInElement } from 'katex';

function App() {
  const [latexcode, setLatexcode] = useState('');
  const [jobdescription, setJobdescription] = useState('');
  const [tailored, setTailored] = useState('');
  const [compileLatex, setCompiledLatex] = useState('');

  const sendAPI = async () => {
    try {
      const response = await fetch('/tailor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latexcode, jobdescription }),
      });

      const data = await response.json();
      setTailored(data.tailored_latex);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  // COMPILE LATEX:

  return (
    <div className="App">
      <h1>OverTailored</h1>
      <div className="main-container">
        <div className="input-container">
          <textarea
            placeholder="Enter LaTeX code here..."
            value={latexcode}
            onChange={(e) => setLatexcode(e.target.value)}
          ></textarea>
          <textarea
            placeholder="Enter job description here..."
            value={jobdescription}
            onChange={(e) => setJobdescription(e.target.value)}
          ></textarea>
          <button className="tailor-button" onClick={sendAPI}>Tailor Resume</button>
        </div>
        {tailored && (
          <div className="output-container">
            <h2>Tailored Resume</h2>
            <textarea className="output" readOnly value={tailored}></textarea>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
