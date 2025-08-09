import React, { useState, useEffect } from 'react';
import ReactAudioContext from './AudioContext';
import TimeContext from './TimeContext'
import ReactAudioContext from './AudioContext';
import DelayContext from './DelayContext';
let audioContext = new AudioContext();
let out = audioContext.destination;


function Music(props) {
    const [bpm, setBpm] = useState(80);
    const [delay, setDelay] = useState(60/bpm);
    const [isPlaying, setIsPlaying] = useState(false);
    const [refreshRate, setRefreshRate] = useState(1);
    let index = 0;
    let nextNote = 0.5;



    useEffect(() => { 

        audioContext.suspend();

        let interval = setInterval(soundLoop, refreshRate);
        let interval2 = setInterval(soundLoop, refreshRate);

        setDelay(prevDelay => (60.0/bpm)/buttons1.length);
        setDelay2(prevDelay => (60.0/bpm)/buttons2.length);
        return () => {
            audioContext.close();
            audioContext = new AudioContext();
            out = audioContext.destination;

            //clearTimeout(timeout);

            clearInterval(interval);
            clearInterval(interval2);

        }
    }, [bpm, delay, buttons1, accent1,buttons2, accent2, delay2]);

    return (
        <div></div>
    )

}