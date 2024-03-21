import React, { isValidElement } from "react";
import { useState, useEffect } from "react";
import CounterCard from "../CounterCard/CounterCard";
import styles from "./MainPage.module.css";
import useSound from 'use-sound';
import buzzer from '../../Assests/buzzer.mp3';
const MainPage = () => {
  const [time, setTime] = useState(0);
  const [inputTime, setInputTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [timer, setTimer] = useState();
  const [playSound] = useSound(buzzer);
  useEffect(() => {
    getTimeFromLocalStorage();
  }, []);

  useEffect(() => {
    setTimeToLocalStorage(inputTime);
    CalculateTime();
    StartTimer(timer);
  }, [isStarted]);

  useEffect(() => {
    CalculateTime();
  }, [inputTime]);

  const getTimeFromLocalStorage = () => {
    const inputTime = localStorage.getItem("inputTime");
    const parsedInput = JSON.parse(inputTime);
    if (parsedInput && new Date(parsedInput.inputTime).getTime() > new Date().getTime()) {
        setIsStarted(parsedInput.isStarted);
        setInputTime(parsedInput.inputTime);
    }
  };
  
  

  const setTimeToLocalStorage = (inputTime) => {
    if (inputTime) {
      const input = {
        inputTime: inputTime,
        isStarted: isStarted,
      };
      localStorage.setItem("inputTime", JSON.stringify(input));
    }
    
  };

  const CalculateTime = () => {
    const currentDate = new Date().getTime();
    const SelectedDateTime = new Date(inputTime).getTime();
    const countDown = SelectedDateTime - currentDate;
    setTime(countDown);
 };

  const StartTimer = (timer) => {
    if (isStarted) {
      let StartTimer = setInterval(() => {
        setTime((prevTime) => prevTime - 1000);
      }, 1000);
      setTimer(StartTimer);
    } else {
      localStorage.removeItem("inputTime");
      clearInterval(timer);
    }
  };


  const validateInput=(time)=>{
    if(time<=0 && inputTime){
      
        return <h1 className={styles.message}>Enter a Vaild Date and Time</h1>;
    }else if(Math.floor(time / 86400000)>99 &&inputTime!==0){
        return <h1  className={styles.message}>Selected time is more than 100 Days</h1>;
    }
  }

  const getTime = (time) => {
    let counterData={days:0,hours:0,minutes:0,seconds:0};
      if (inputTime){
        if( time < 1000 ) {
            if(isStarted){
              
                playSound();
                localStorage.removeItem("inputTime");
                setIsStarted(false);     
            }else{
                return <h1  className={styles.message}>the countdown is over! What's next on your adventure?</h1>;
              }
      }
      counterData.days = Math.floor(time / 86400000);
      counterData.hours = Math.floor((time % 86400000) / 3600000);
      counterData.minutes = Math.floor((time % 3600000) / 60000);
      counterData.seconds = Math.floor(time / 1000) % 60;
      }
    const entries = Object.entries(counterData);
    return (
        entries.map(([property, value])=>{
            return <CounterCard property={property} key={property} value={value}/>
        })
    );
      
  };

  const handleStartStop = () => {
    if(inputTime && !validateInput(time)){
        if(isStarted){
            setInputTime(null);
        }
        setIsStarted(!isStarted);
    }
    
  };

  const handleInputTime = (e) => {
    if (!isStarted) {
      setInputTime(e.target.value);
    }
  };

  return (
    <div className={styles.MainPagecon}>
      <h1 className={styles.MainPagehead}>Countdown<span className={styles.MainPageheadSpan}> timer</span> </h1>
      <div className={styles.MainPageInputCon}>
      <input
        type="datetime-local"
        className={styles.MainPageInput}
        value={inputTime}
        onChange={(e) => {
          handleInputTime(e);
        }}
      />
      <button className={styles.MainPageStartStopBtn}
        onClick={() => {
          handleStartStop();
        }}
      >
        {isStarted ? "Cancel Timer" : "Start Timer"}
      </button>
      </div>
      
      <div className={styles.MainPageCounter}>
      {validateInput(time)?validateInput(time):getTime(time)}
      </div>
      
    </div>
  );
};

export default MainPage;
