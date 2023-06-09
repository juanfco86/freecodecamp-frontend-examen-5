import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import Footer from './Components/Footer/Footer';

function App() {
  const [breakLabel, setBreakLabel] = useState(5*60);
  const [sessionLabel, setSessionLabel] = useState(25*60);
  const [timerStatus, setTimerStatus] = useState(false)
  const [timerStatusSession, setTimerStatusSession] = useState(false)
  const [timerStatusBreak, setTimerStatusBreak] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [pause, setPause]  = useState(false)
  const beepAudio = useRef(null)
  
  const formatTime = (time) => {
    let minutes = Math.floor(time/60)
    let seconds = time % 60
    return (
        (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
      )
    }
    
  const [result, setResult] = useState(formatTime(25 * 60))

  useEffect(() => {
    if (!timerStatusSession && !timerStatus) {
      setResult(formatTime(sessionLabel))
    } else if (timerStatusBreak) {
      setResult(formatTime(breakLabel))
    } else {
      setResult(formatTime(sessionLabel))
    }
  }, [sessionLabel, breakLabel, timerStatusBreak, timerStatusSession, timerStatus]);

  useEffect(() => {
    if (!pause) {
      let interval = null;
      setPause(false)
      if (timerStatus) {
        interval = setInterval(() => {
          setResult(prevResult => {
            let seconds = parseInt(prevResult.split(':')[1]);
            let minutes = parseInt(prevResult.split(':')[0]);

            seconds--;
            if (seconds < 0) {
              seconds = 59;
              minutes--;
            }
  
            const updatedResult = formatTime(minutes * 60 + seconds)
  
            if (prevResult === '00:00') {
              beepAudio.current.play()
              clearInterval(interval);
  
              if (!timerStatusBreak) {
                setResult(formatTime(breakLabel))
                setTimerStatusSession(false);
                setTimerStatusBreak(true);
                setCountdown(null);
              } else {
                setResult(formatTime(sessionLabel))
                setTimerStatusBreak(false);
                setTimerStatusSession(true);
              }
            }
            return updatedResult;
          });
        }, 100);
      }
      setCountdown(interval);
    }
  }, [pause, timerStatus, timerStatusBreak, timerStatusSession, breakLabel, sessionLabel]);

  useEffect(() => {
    return () => {
      clearInterval(countdown)
    } 
  }, [countdown, pause]);
  
  
  const timer = () => {
    if (!timerStatus) {
      setResult(formatTime(sessionLabel))
      setPause(false)
      setTimerStatus(true);
        
      if (!timerStatusSession && !timerStatusBreak) {
        setTimerStatusSession(true)
        setResult(formatTime(sessionLabel))
      } else if (!timerStatusSession && timerStatusBreak) {
        setTimerStatusBreak(true)
        setResult(formatTime(breakLabel))
      } else if (!timerStatusBreak && timerStatusSession) {
        setTimerStatusSession(true)
        setResult(formatTime(sessionLabel))
      }
    } else {
      setPause(!pause)
    } 
  }

  const breakDecrement = () => {
    if (breakLabel > 60) {
      setBreakLabel(breakLabel - 60)
    } else {
      setBreakLabel(60);
    }
  }

  const breakIncrement = () => {
    if (breakLabel < 3600) {
      setBreakLabel(breakLabel + 60)
    } else if (breakLabel <= 0) {
      setBreakLabel(0)
    } else {
      setBreakLabel(3600);
    }
  }

  const sessionDecrement = () => {
    if (sessionLabel > 60) {
      setSessionLabel(sessionLabel - 60)
    } else {
      setSessionLabel(60);
    }
  }

  const sessionIncrement = () => {
    if (sessionLabel < 3600) {
      setSessionLabel(sessionLabel + 60)
    } else {
      setSessionLabel(3600);
    }
  }

  const resetAll = () => {
    clearInterval(countdown);
    setSessionLabel(25*60);
    setBreakLabel(5*60);
    setResult(formatTime(25*60));
    setTimerStatus(false)
    setTimerStatusSession(false);
    setTimerStatusBreak(false);
    setPause(false)
    beepAudio.current.pause()
    beepAudio.current.load()
  }
  
  return (
    <>
      <div className='container'>
        <h1>Pomodoro Time</h1>
        <div className='container-label'>
            <div id="break-label">
                <h6 className="h6--style">Break Length</h6>
                <button id="break-decrement" onClick={ breakDecrement }>
                  <i className="bi bi-dash-circle"></i>
                </button>
                <p id="break-length">{ breakLabel / 60 }</p>
                <button id="break-increment" onClick={ breakIncrement }>
                  <i className="bi bi-plus-circle"></i>
                </button>
            </div>
            <div id="session-label">
                <h6 className="h6--style">Session Length</h6>
                <button id="session-decrement" onClick={ sessionDecrement }>
                  <i className="bi bi-dash-circle"></i>
                </button>
                <p id="session-length">{ sessionLabel / 60 }</p>
                <button id="session-increment" onClick={ sessionIncrement }>
                  <i className="bi bi-plus-circle"></i>
                </button>
            </div>
        </div>
        <div className='container-time-left'>
            <h6 id="timer-label">
              {
                !timerStatusBreak ? 'session' : 'break'
              }  
            </h6>
            <p id="time-left" className='time-value'>
              {
                result
              }
            </p>
        </div>
        <div className='container--icons'>
          <button id="start_stop" className="button--style" onClick={ timer }>
            {
              !timerStatus ?  <i className={`bi bi-play-circle-fill icons--style`}></i> :
              pause ?         <i className={`bi bi-play-circle-fill icons--style`}></i> :
                              <i className={`bi bi-pause-circle-fill icons--style`}></i>
            }
          </button>
          <button id="reset" className="button--style" onClick={ resetAll }>
            <i className="bi bi-x-circle-fill icons--style"></i>
          </button>
          
        </div>
        
        <Footer />

        <audio id="beep" ref={ beepAudio }>
          <source src="https://res.cloudinary.com/dgquecmyz/video/upload/v1686273787/button-2_evftg3.mp3" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>

      </div>
    </>
  );
}

export default App;
