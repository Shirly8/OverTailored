import { useState } from 'react'
import viteLogo from './assets/images/3.png'
import sendIcon from './assets/icon/1.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)
  const [sentChat, sendChat] = useState(false)

  const sendClick = () => {
    sendChat(true)
  }

  return (
    <>
      <div>
        
          <img src={viteLogo} className="logo"/>
      </div>
      <input text = "text" className = "title-box" placeholder = "Title"></input>
      <div className = "description-container">
       <textarea class = "description-box"> </textarea>
       <img src = {sendIcon} className = "send-icon" onClick = {sendChat}></img>
      </div>
      
      <div className = "button-container">
        <button class = "save-button">Save</button>
        <button class = "regenerate-button">Regenerate </button>
      </div>


    {sentChat && (
    <>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )}
  </>
  )}

export default App
