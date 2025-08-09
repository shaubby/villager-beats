import React, { useState, useEffect } from 'react';
import ReactAudioContext from './AudioContext';
import TimeContext from './TimeContext'
import ReactAudioContext from './AudioContext';
import DelayContext from './DelayContext';
let audioContext = new AudioContext();
let out = audioContext.destination;

let sounds1 = [true, true, true, true, true, true, true, true]
function Music(props) {
    const [bpm, setBpm] = useState(80);
    const [delay, setDelay] = useState(60/bpm);
    const [isPlaying, setIsPlaying] = useState(false);
    const [refreshRate, setRefreshRate] = useState(1);
    const [state, setState] = useState('running');
    let index = 0;
    let nextNote = 0.5;

    const soundLoop = () => {
        setState(prevstate => audioContext.state);
        if (audioContext.currentTime > nextNote) {
            nextNote += delay;
            if (index >= sounds1.length) {
                index = 0;
            }
            if (sounds1[index]) {
                console.log("yay");
            }
            index++;
        }
    }

    

    useEffect(() => { 

        audioContext.suspend();

        let interval = setInterval(soundLoop, refreshRate);

        setDelay(prevDelay => (60.0/bpm));
        return () => {
            audioContext.close();
            audioContext = new AudioContext();
            out = audioContext.destination;

            //clearTimeout(timeout);

            clearInterval(interval);

        }
    }, [bpm, delay]);

    return (
        <div>click me pls</div>
    )

}