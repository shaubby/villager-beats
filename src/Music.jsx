import React, { useState, useEffect } from 'react';
import ReactAudioContext from './AudioContext';
import TimeContext from './TimeContext'
import DelayContext from './DelayContext';
import villager1Audio from './assets/villager1.mp3';
import villager2Audio from './assets/villager2.mp3';
import villager3Audio from './assets/villager3.mp3';
import villager4Audio from './assets/villager4.mp3';
import "./App.css";
import { MdPlayArrow } from 'react-icons/md';

let audioContext = new AudioContext();
let out = audioContext.destination;
let audioBuffers = []; // Array to store multiple audio buffers

const audioFiles = [villager1Audio, villager2Audio, villager3Audio, villager4Audio];

// Function to load all audio files
const loadAudio = async () => {
    try {
        audioBuffers = [];
        for (let i = 0; i < audioFiles.length; i++) {
            const response = await fetch(audioFiles[i]);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await audioContext.decodeAudioData(arrayBuffer);
            audioBuffers[i] = buffer;
        }
        console.log('All audio files loaded successfully');
    } catch (error) {
        console.error('Error loading audio:', error);
    }
};

// Function to play the audio by index
const playAudio = (audioIndex = 0) => {
    if (audioBuffers[audioIndex] && audioContext.state === 'running') {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers[audioIndex];
        source.connect(out);
        source.start();
    }
};


function Music(props) {
    const [bpm, setBpm] = useState(80);
    const [delay, setDelay] = useState(60/bpm);
    const [isPlaying, setIsPlaying] = useState(false);
    const [refreshRate, setRefreshRate] = useState(1);
    const [state, setState] = useState('suspended');
    const [selectedAudio, setSelectedAudio] = useState(0); // Track which audio file to use    
    let index = 0;
    let nextNote = 0;

    const soundLoop = () => {
        setState(prevstate => audioContext.state);
        if (audioContext.currentTime > nextNote) {
            nextNote += delay;
            if (index >= props.sounds1.length) {
                index = 0;
            }
            if (props.sounds1 && props.sounds1[index]) {
                // Play audio from sequence consecutively
                const currentAudioIndex = 0;
                playAudio(currentAudioIndex);
                console.log(`Playing sound from sequence 1 at index ${index}`);
            }
            if (props.sounds2 && props.sounds2[index]) {
                // Play audio from sequence consecutively
                const currentAudioIndex = 1;
                playAudio(currentAudioIndex);
                console.log(`Playing sound from sequence 1 at index ${index}`);
            }
            if (props.sounds3 && props.sounds3[index]) {
                // Play audio from sequence consecutively
                const currentAudioIndex = 2;
                playAudio(currentAudioIndex);
                console.log(`Playing sound from sequence 1 at index ${index}`);
            }
            if (props.sounds4 && props.sounds4[index]) {
                // Play audio from sequence consecutively
                const currentAudioIndex = 3;
                playAudio(currentAudioIndex);
                console.log(`Playing sound from sequence 1 at index ${index}`);
            }
            index++;
        }
    }

    const handleAudioSelect = (audioIndex) => {
        setSelectedAudio(audioIndex);
    };

    const updateSequence = (newSequence) => {
        setAudioSequence(newSequence);
        setSequenceIndex(0); // Reset sequence position
    };

    useEffect(() => { 
        // Load all audio files when component mounts
        loadAudio();

        audioContext.suspend();

        let interval = setInterval(soundLoop, refreshRate);

        setDelay(prevDelay => (60.0/bpm));
        return () => {
            audioContext.close();
            audioContext = new AudioContext();
            out = audioContext.destination;
            audioBuffers = []; // Reset audio buffers
            
            clearInterval(interval);
        }
    }, [bpm, delay]);

    return (
        <div>
            <div className='play' onClick = {() => {
                    if(audioContext.state =='suspended') {
                        audioContext.resume();
                    } else {
                        audioContext.suspend();
                    }}}><MdPlayArrow/></div>
                
        </div>
    )
}

export default Music;