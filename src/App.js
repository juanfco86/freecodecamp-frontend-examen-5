import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import Footer from './Components/Footer/Footer';

function App() {
  const [breakLabel, setBreakLabel] = useState(5);
  const [sessionLabel, setSessionLabel] = useState(25);
  const [result, setResult] = useState(`${sessionLabel}:00`)
  const [timerStatus, setTimerStatus] = useState(false)
  const [timerStatusSession, setTimerStatusSession] = useState(false)
  const [timerStatusBreak, setTimerStatusBreak] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [pause, setPause]  = useState(false)
  const beepAudio = useRef(null)

  useEffect(() => {
    if ((sessionLabel < 10 && timerStatusSession) || (sessionLabel < 10 && !timerStatusBreak && !timerStatusSession)) {
      setResult(`0${sessionLabel}:00`)
    } else if ((sessionLabel <= 0 && timerStatusSession) || (sessionLabel <= 0 && !timerStatusBreak && !timerStatusSession)) {
      setResult(`${breakLabel}:00`)
    } else if ((sessionLabel >= 10 && timerStatusSession) || (sessionLabel >= 10 && !timerStatusBreak && !timerStatusSession)) {
      setResult(`${sessionLabel}:00`)
    } else if (breakLabel < 10 && timerStatusBreak) {
      setResult(`0${breakLabel}:00`)
    } else if (breakLabel >= 10 && timerStatusBreak) {
      setResult(`${breakLabel}:00`)
    }
  }, [sessionLabel, breakLabel, timerStatusBreak, timerStatusSession]);

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
  
            const updatedResult = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  
            if (minutes <= 0 && seconds === 0) {
              beepAudio.current.play()
              clearInterval(interval);
  
              if (!timerStatusBreak) {
                minutes = breakLabel
                setTimerStatusSession(false);
                setTimerStatusBreak(true);
                setCountdown(null);
              } else {
                setResult(`${sessionLabel}:00`)
                setTimerStatusBreak(false);
                setTimerStatusSession(true);
                // setCountdown(null);
              }
            }
  
            return updatedResult;
          });
        }, 100);
      }
      setCountdown(interval);
    }
  }, [pause, timerStatus, timerStatusBreak, timerStatusSession]);

  useEffect(() => {
    return () => {
      clearInterval(countdown)
    } 
  }, [countdown, pause]);
  
  const updateCountSession = (minutes, seconds) => {
    if (minutes < 10 && seconds < 10) {
      return `0${minutes}:0${seconds}`
    } else if (minutes < 10) {
      return `0${minutes}:${seconds}`;
    } else if (seconds < 10) {
      return `${minutes}:0${seconds}`;
    } else {
      return `${minutes}:${seconds}`;
    }
  }
  
  const timer = () => {
    if (!timerStatus) {
      setResult(`${sessionLabel < 10 ? '0' + sessionLabel : sessionLabel}:00`)
      setPause(false)
      setTimeout(() => {
        setTimerStatus(true);
        let seconds = 0;
        let minutes;
        
        if (!timerStatusSession && !timerStatusBreak) {
          minutes = sessionLabel;
          setTimerStatusSession(true)
          setResult(`${minutes}:${seconds}`)
        } else if (!timerStatusSession && timerStatusBreak) {
          minutes = breakLabel;
          setTimerStatusBreak(true)
          if (minutes < 10) {
            setResult(`0${minutes}:${seconds}`)
          } else {
            setResult(`${minutes}:${seconds}`)
          }
        } else if (!timerStatusBreak && timerStatusSession) {
          minutes = sessionLabel;
          setTimerStatusSession(true)
          setResult(`${minutes}:${seconds}`)
        }

        let interval = setInterval(() => {
          if (!pause) {
              seconds--;
              if (seconds < 0) {
                seconds = 59;
                minutes--;
              }

              const duration = updateCountSession(minutes, seconds)
              setResult(duration)

              if (minutes <= 0 && seconds === 0) {
                setTimerStatus(false)

                if (!timerStatusBreak) {
                  minutes = breakLabel
                  setResult(`${minutes}:${seconds}`)
                  setTimerStatusSession(false)
                  setTimerStatusBreak(true)
                  clearInterval(countdown);
                  timer()
                } else {
                  console.log('entro');
                  setResult(`${sessionLabel}:00`)
                  setTimerStatusBreak(false)
                  setTimerStatus(false)
                  setTimerStatusSession(true)
                  setPause(true)
                  clearInterval(countdown);
                }
              }
              setResult(duration);
              return result;
            }
          }, 1000)
          setCountdown(interval)
        }, 10)
      } else {
        setPause(!pause)
      } 
    }

  const breakDecrement = () => {
    if (breakLabel > 1) {
      setBreakLabel(breakLabel - 1)
    } else {
      setBreakLabel(1);
    }
  }

  const breakIncrement = () => {
    if (breakLabel < 60) {
      setBreakLabel(breakLabel + 1)
    } else if (breakLabel <= 0) {
      setBreakLabel(0)
    } else {
      setBreakLabel(60);
    }
  }

  const sessionDecrement = () => {
    if (sessionLabel > 1) {
      setSessionLabel(sessionLabel - 1)
    } else {
      setSessionLabel(1);
    }
  }

  const sessionIncrement = () => {
    if (sessionLabel < 60) {
      setSessionLabel(sessionLabel + 1)
    } else {
      setSessionLabel(60);
    }
  }

  const resetAll = () => {
    clearInterval(countdown);
    setSessionLabel(25);
    setBreakLabel(5);
    setTimerStatus(false)
    setTimerStatusSession(false);
    setTimerStatusBreak(false);
    setCountdown(null)
    setPause(false)
    const defaultResult = `${25}:00`
    setResult(defaultResult);
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
                <p id="break-length">{ breakLabel }</p>
                <button id="break-increment" onClick={ breakIncrement }>
                  <i className="bi bi-plus-circle"></i>
                </button>
            </div>
            <div id="session-label">
                <h6 className="h6--style">Session Length</h6>
                <button id="session-decrement" onClick={ sessionDecrement }>
                  <i className="bi bi-dash-circle"></i>
                </button>
                <p id="session-length">{ sessionLabel }</p>
                <button id="session-increment" onClick={ sessionIncrement }>
                  <i className="bi bi-plus-circle"></i>
                </button>
            </div>
        </div>
        <div className='container-time-left'>
            <h6 id="timer-label">
              {
                !timerStatusBreak ? 'Session' : 'Break'
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
          <source src="https://res.cloudinary.com/dgquecmyz/video/upload/v1686254527/Beep_Short_01_Sound_Effect_Mp3_102_xfkfzo.mp3" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>

      </div>
    </>
  );
}

export default App;
