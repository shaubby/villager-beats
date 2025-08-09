import React, { useState, useEffect, useRef } from 'react';
import ReactAudioContext from './AudioContext';
import TimeContext from './TimeContext'
import DelayContext from './DelayContext';
import villager1Audio from './assets/renran.mp3';
import villager2Audio from './assets/sarah.mp3';
import villager3Audio from './assets/clay.mp3';
import villager4Audio from './assets/vellager4.mp3';
import "./App.css";
import { MdPlayArrow, MdPause } from 'react-icons/md';

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
    const [delay, setDelay] = useState(60/props.bpm);
    const [isPlaying, setIsPlaying] = useState(false);
    const [refreshRate, setRefreshRate] = useState(1);
    const [state, setState] = useState('suspended');
    const [selectedAudio, setSelectedAudio] = useState(0); // Track which audio file to use    
    
    // Use refs to persist values across renders
    const indexRef = useRef(0);
    const nextNoteRef = useRef(0);

    const soundLoop = () => {
        setState(prevstate => audioContext.state);
        if (audioContext.currentTime > nextNoteRef.current) {
            nextNoteRef.current += delay;
            console.log(nextNoteRef.current);
            
            // Check if props.sounds exists and has arrays
            if (!props.sounds || !Array.isArray(props.sounds) || props.sounds.length === 0) {
                return; // Exit early if no sounds data
            }
            
            // Check if we've reached the end of the sequence
            if (indexRef.current >= props.sounds[0].length) {
                indexRef.current = 0;
            }
            
            // Check each sound track
            console.log('Current index:', indexRef.current);

            if (props.sounds[0][indexRef.current]) {
                const currentAudioIndex = 0;
                playAudio(currentAudioIndex);
                //console.log(`Playing sound from sequence 0 at index ${indexRef.current}`);
            }
            if (props.sounds[1] && props.sounds[1][indexRef.current]) {
                const currentAudioIndex = 1;
                playAudio(currentAudioIndex);
                //console.log(`Playing sound from sequence 1 at index ${indexRef.current}`);
            }
            if (props.sounds[2] && props.sounds[2][indexRef.current]) {
                const currentAudioIndex = 2;
                playAudio(currentAudioIndex);
                //console.log(`Playing sound from sequence 2 at index ${indexRef.current}`);
            }
            if (props.sounds[3] && props.sounds[3][indexRef.current]) {
                const currentAudioIndex = 3;
                playAudio(currentAudioIndex);
                //console.log(`Playing sound from sequence 3 at index ${indexRef.current}`);
            }
            indexRef.current++;
        }
    }

    const handleAudioSelect = (audioIndex) => {
        setSelectedAudio(audioIndex);
    };

    useEffect(() => { 
        // Load all audio files when component mounts
        loadAudio();

        audioContext.suspend();

        let interval = setInterval(soundLoop, refreshRate);

        setDelay(prevDelay => (60.0/bpm));
        return () => {
            setIsPlaying(false);
            audioContext.close();
            audioContext = new AudioContext();
            out = audioContext.destination;
            audioBuffers = []; // Reset audio buffers
            
            clearInterval(interval);
        }
    }, [bpm, delay, props.sounds, props.bpm]);

    return (
        <div>
            <div className='play' onClick = {() => {
                    if(audioContext.state =='suspended') {
                        indexRef.current = 0;
                        audioContext.resume();
                        nextNoteRef.current = audioContext.currentTime+0.1;

                        setIsPlaying(true);
                        console.log('Audio context resumed');
                        console.log('Props sounds:', props.sounds);
                    } else {
                        audioContext.suspend();
                        setIsPlaying(false);
                        console.log('Audio context suspended');
                        console.log('Props sounds:', props.sounds);
                    }}}>{isPlaying ? <MdPause /> : <MdPlayArrow/>}</div>
                
        </div>
    )
}

export default Music;