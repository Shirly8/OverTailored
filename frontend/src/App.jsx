import React, { useState, useEffect } from 'react';
import viteLogo from './assets/images/3.png'
import affirmlyIcon from './assets/icon/2.svg' 

import './App.css'

function App() {
  const [affirmations, setAffirmations] = useState([]) // Array
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false);
  const [heartClicked, setHeartClicked] = useState({});
  const [popup, showPopup] = useState(false)
  const [popupMessage, showMessage] = useState("")

  const sendAPI = async () => {

    setLoading(true);

    // Fetch from Flask app.py
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
      });

      // Sending journal entry to LLM
      const data = await response.json();
      setAffirmations(data);
    } catch (error) {
      console.error('Error: ', error);
    }finally {
      setLoading(false);
    }
  }

  const regenerateClick = () => {
    sendAPI();
  }


  //Animate the loading dots
  const useLoadingDots = () => {
    const [dots, setDots] = useState('');
    useEffect(() => {
      if (loading) {
        const interval = setInterval(() => {
          setDots(prev => prev.length < 10 ? prev + '.' : '');
        }, 500);
        return () => clearInterval(interval);
      }
    }, [loading]);
    return dots;
  }
  const loadingDots = useLoadingDots();

  //Toggling the heart icon
  const handleHeartClick = (index) => {
    setHeartClicked(prev => ({ ...prev, [index]: !prev[index] }));
  }

  //Saving Journal Entry
  const saveEntry = async () => {
    const date = new Date().toISOString();
    const heartedAffs = affirmations.filter((_, index) => heartClicked[index]);
    const entry = {
      title,
      description,
      date,
      affirmations: heartedAffs
    };

    try {
      const response = await fetch('/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      });
        const data = await response.json();
        console.log(data.message)

        //SHOW POPUP
        showMessage(`Affirmly Entry: "${title}" is saved`)
        showPopup(true);

    }catch (error){
      console.log(error);
    }
}
  // Close popup
  const closePopup = () => {
    showPopup(false);
  };

  // Create new entry
  const newEntry = () => {
    closePopup();
    setTitle("");
    setDescription("");
    setAffirmations([]);
    heartClicked({});
  };

  // Logic to view saved entries
  const viewEntries = () => {
  };

  return (
    <>
      {/* Top menu bar */}
      <div className = "topmenu">
      <div className="bar" onClick={() => console.log("Menu clicked")} />
      <img src={viteLogo} className="logo" alt="Vite Logo" />
        <div className="search" onClick={() => console.log("Search clicked")} />
      </div>

      {/* Journal Entry */}
      <input type="text" className="title-box" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="description-container">
        <textarea className="description-box" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <div className="send-icon" onClick={sendAPI} />

      </div>

      <div className="button-container">
        <button className="save-button" onClick = {saveEntry}>Save</button>
        <button className="regenerate-button" onClick={regenerateClick}>Regenerate</button>
      </div>

      <div className = "AffirmlySays">
        <img src = {affirmlyIcon} className = "affirmlylogo"></img>
        <h2>Affirmly Says {loading && <span>{loadingDots}</span>}</h2>
      </div>

      {/* Affirmations generation */}
      {affirmations.length > 0 && (
        <div className="affirmations-container">
          {affirmations.map((affirmation, index) => (
            <div key={index} className="individual-affirmations">
              <p>{affirmation}</p>
              <div className = {heartClicked[index] ? "hearted-icon" : "heart-icon"} onClick={() => handleHeartClick(index)}/>
            </div>
          ))}
        </div>
      )}

    {/* Affirmly Entries saved notification */}
    {popup && (
      <div className = "popup">
        <div className = "popup-content">
        <span className="close" onClick={closePopup}>&times;</span>
        <h2>{popupMessage}</h2>
        <button className = "popup-button" onClick={newEntry}>New Affirmly Entry</button>
        <button className = "popup-button" onClick={viewEntries}>Your Affirmlies</button>
        </div>
      </div>
    )}



    </>
  )
}

export default App
