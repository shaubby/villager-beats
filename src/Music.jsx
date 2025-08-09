import React, { useState, useEffect } from 'react';
import ReactAudioContext from './AudioContext';
import TimeContext from './TimeContext'
import DelayContext from './DelayContext';
import villager1Audio from './assets/villager2.mp3';
import './music.css';

let audioContext = new AudioContext();
let out = audioContext.destination;
let audioBuffer = null;

// Function to load audio file
const loadAudio = async () => {
    try {
        const response = await fetch(villager1Audio);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
        console.error('Error loading audio:', error);
    }
};

// Function to play the audio
const playAudio = () => {
    if (audioBuffer && audioContext.state === 'running') {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(out);
        source.start();
    }
};

let sounds1 = [true, true, true, true, true, true, true, true];
function Music(props) {
    const [bpm, setBpm] = useState(80);
    const [delay, setDelay] = useState(60/bpm);
    const [isPlaying, setIsPlaying] = useState(false);
    const [refreshRate, setRefreshRate] = useState(1);
    const [state, setState] = useState('suspended');
    let index = 0;
    let nextNote = 0;

    const soundLoop = () => {
        setState(prevstate => audioContext.state);
        if (audioContext.currentTime > nextNote) {
            nextNote += delay;
            if (index >= sounds1.length) {
                index = 0;
            }
            if (sounds1[index]) {
                playAudio();
            }
            index++;
        }
    }

    useEffect(() => { 
        // Load the audio file when component mounts
        loadAudio();

        audioContext.suspend();

        let interval = setInterval(soundLoop, refreshRate);

        setDelay(prevDelay => (60.0/bpm));
        return () => {
            audioContext.close();
            audioContext = new AudioContext();
            out = audioContext.destination;
            audioBuffer = null; // Reset audio buffer
            
            clearInterval(interval);
        }
    }, [bpm, delay]);

    return (
        <div className='playButton' onClick = {() => {
                if(audioContext.state =='suspended') {
                    audioContext.resume();
                } else {
                    audioContext.suspend();
                }}}>click me pls</div>
    )

}
export default Music;