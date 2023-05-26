import { useState } from 'react';
import './App.css';
import Footer from './Components/Footer/Footer';
import { useEffect } from 'react';

// FALTA HACER FUNCIONAL EL BOTON DE PAUSE
// CUANDO LLEGA A 0 SE PONE EL CONTADOR DE BREAK PERO SIGUE BAJANDO LA CUENTA AUTOMATICAMENTE
// BREAK TAMPOCO SE PARA EL CONTADOR AL CLIKEAR EN RESET

function App() {
  const [breakLabel, setBreakLabel] = useState(5);
  const [sessionLabel, setSessionLabel] = useState(25);
  const [result, setResult] = useState(`${sessionLabel}:00`)
  const [timerStatusSession, setTimerStatusSession] = useState(false)
  const [timerStatusBreak, setTimerStatusBreak] = useState(false)
  const [countdown, setCountdown] = useState(null)
  

  useEffect(() => {
    if (sessionLabel < 10) {
      setResult(`0${sessionLabel}:00`)
    } else {
      setResult(`${sessionLabel}:00`)
    }
  }, [sessionLabel]);
  
  const updateCountSession = (minutes, seconds) => {
    if (seconds < 10) {
      return `${minutes}:0${seconds}`
    } else if (minutes < 10) {
      return `0${minutes}:${seconds}`;
    } else if (minutes < 10 && seconds < 10) {
      return `0${minutes}:0${seconds}`;
    } else {
      return `${minutes}:${seconds}`;
    }
  }
  
  const timer = () => {
    let seconds = 0;
    let minutes = sessionLabel;

    if (!timerStatusSession) {
      setTimerStatusSession(true)
      setCountdown(setInterval(() => {
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        const duration = updateCountSession(minutes, seconds)
        if (minutes === 0 && seconds === 0 && !timerStatusBreak) {
          minutes = breakLabel
          setTimerStatusSession(false)
          setResult(`${breakLabel}:00`)
          setTimerStatusBreak(true)
          clearInterval(countdown);
        } else if (minutes === 0 && seconds === 0 && timerStatusBreak) {
          setResult(`${sessionLabel}:00`)
          setTimerStatusBreak(false)
          clearInterval(countdown);
        }
        setResult(duration);
  
        return result;
        
      }, 1000))
    }
  }

  const breakDecrement = () => {
    if (breakLabel > 0) {
      setBreakLabel(breakLabel - 1)
    } else {
      setBreakLabel(0);
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
    if (sessionLabel > 0) {
      setSessionLabel(sessionLabel - 1)
    } else {
      setSessionLabel(0);
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
    setBreakLabel(5);
    setSessionLabel(25);
    setTimerStatusSession(false);
    setCountdown(null)
    setResult(`${sessionLabel}:00`);
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
        <div id="time-left">
            <h6 id="timer-label">
              {
                !timerStatusBreak ? 'Session' : 'Break'
              }  
            </h6>
            <p className='time-value'>
              {
                result
              }
            </p>
        </div>
        <div className='container--icons'>
          <button id="start_stop" className="button--style" onClick={ timer }>
            {
              !timerStatusSession ? <i className="bi bi-play-circle-fill icons--style"></i> : <i className="bi bi-pause-circle-fill icons--style"></i>
            }
          </button>
          <button id="reset" className="button--style" onClick={ resetAll }>
            <i className="bi bi-x-circle-fill icons--style"></i>
          </button>
          
        </div>
        
        <Footer />

        {/* AUDIO CON UN SONIDO BEEP PARA FINALIZAR? */}

      </div>
    </>
  );
}

export default App;
