import { useState } from 'react';
import './App.css';
import Footer from './Components/Footer/Footer';

function App() {
  const [breakLabel, setBreakLabel] = useState(5);
  const [sessionLabel, setSessionLabel] = useState(25);
  const [timerStatusSession, setTimerStatusSession] = useState(false)
  const [timerStatusBreak, setTimerStatusBreak] = useState(false)
  
  const secondsSession = 1000
  const minutesSession = secondsSession * 60
  const hoursSession = minutesSession * 60
  
  const updateCountSession = () => {
    const today = new Date();
    const seconds = Math.floor((today % minutesSession) / secondsSession)
    const minutes = Math.floor((today % hoursSession) / minutesSession)
    if (seconds < 10) {
      return `${minutes}:0${seconds}`
    } else {
      return `${minutes}:${seconds}`;
    }
  }
  console.log(updateCountSession());
  setInterval(updateCountSession, 1000)
  
  const timer = () => {
    const secondsSessionTimer = sessionLabel * 60 * 1000
    const secondsBreakTimer = breakLabel * 60 * 1000

    if (timerStatusSession) {
      setTimerStatusSession(false)
    } else {
      setTimerStatusSession(true)
    }

    setTimeout(() => {
      console.log('CULAZO');
      setTimerStatusSession(false)
      setTimerStatusBreak(true)

      setTimeout(() => {
        console.log('TETAZAS');
        setTimerStatusBreak(false)
      }, secondsBreakTimer)

    }, secondsSessionTimer)
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
    setBreakLabel(5);
    setSessionLabel(25);
  }

  return (
    <>
      <div className='container'>
        <h1>Pomodoro Time</h1>
        <div className='container-label'>
            <div id="break-label">
                <h6 className="h6--style">Break Length</h6>
                <button id="break-decrement" onClick={ breakDecrement }>
                  <i class="bi bi-dash-circle"></i>
                </button>
                <p id="break-length">{ breakLabel }</p>
                <button id="break-increment" onClick={ breakIncrement }>
                  <i class="bi bi-plus-circle"></i>
                </button>
            </div>
            <div id="session-label">
                <h6 className="h6--style">Session Length</h6>
                <button id="session-decrement" onClick={ sessionDecrement }>
                  <i class="bi bi-dash-circle"></i>
                </button>
                <p id="session-length">{ sessionLabel }</p>
                <button id="session-increment" onClick={ sessionIncrement }>
                  <i class="bi bi-plus-circle"></i>
                </button>
            </div>
        </div>
        <div id="time-left">
          <h6 id="timer-label">Session</h6>
            <p className='time-value'>
              {
                !timerStatusSession ? `${sessionLabel}:00` : 'PRUEBA'
              }
            </p>
        </div>
        <div className='container--icons'>
          <button id="start_stop" className="button--style" onClick={ timer }>
            {
              !timerStatusSession ? <i class="bi bi-play-circle-fill icons--style"></i> : <i className="bi bi-pause-circle-fill icons--style"></i>
            }
          </button>
          <button id="reset" className="button--style" onClick={ resetAll }>
            <i class="bi bi-x-circle-fill icons--style"></i>
          </button>
          
        </div>
        <Footer />

        {/* AUDIO CON UN SONIDO BEEP PARA FINALIZAR? */}

      </div>
    </>
  );
}

export default App;
