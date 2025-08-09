import { useState, useRef, useEffect } from "react";
import { MdAdd, MdOutlineRemove, MdPlayArrow, MdPause } from "react-icons/md";
import "./App.css";
import Music from './Music';
import villager1Audio from './assets/renran.mp3';
import villager2Audio from './assets/sarah.mp3';
import villager3Audio from './assets/clay.mp3';
import villager4Audio from './assets/villager4.mp3';
import villager5Audio from './assets/deven.mp3';
import villager6Audio from './assets/paolo.mp3';
import villager7Audio from './assets/snare.mp3';
import villager8Audio from './assets/kick.mp3';
let audioContext = new AudioContext();
let out = audioContext.destination;
let audioBuffers = []; // Array to store multiple audio buffers

const audioFiles = [villager1Audio, villager2Audio, villager3Audio, villager4Audio, villager5Audio, villager6Audio, villager7Audio, villager8Audio];

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

function App() {
  const [Tempo, setTempo] = useState(240);
  const [Volume, setVolume] = useState(80);
  const [musicGrid, setMusicGrid] = useState(Array.from({ length: 8 }, () => Array(8).fill(false)));
  const [columns, setColumns] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [delay, setDelay] = useState(60/Tempo);
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
          
          
          // Check if we've reached the end of the sequence
          if (indexRef.current >= musicGrid[0].length) {
              indexRef.current = 0;
          }
          
          // Check each sound track
          console.log('Current index:', indexRef.current);

          if (musicGrid[0][indexRef.current]) {
              const currentAudioIndex = 0;
              playAudio(currentAudioIndex);
              //console.log(`Playing sound from sequence 0 at index ${indexRef.current}`);
          }
          if (musicGrid[1] && musicGrid[1][indexRef.current]) {
              const currentAudioIndex = 1;
              playAudio(currentAudioIndex);
              //console.log(`Playing sound from sequence 1 at index ${indexRef.current}`);
          }
          if (musicGrid[2] && musicGrid[2][indexRef.current]) {
              const currentAudioIndex = 2;
              playAudio(currentAudioIndex);
              //console.log(`Playing sound from sequence 2 at index ${indexRef.current}`);
          }
          if (musicGrid[3] && musicGrid[3][indexRef.current]) {
              const currentAudioIndex = 3;
              playAudio(currentAudioIndex);
              //console.log(`Playing sound from sequence 3 at index ${indexRef.current}`);
          }
          if (musicGrid[4][indexRef.current]) {
              const currentAudioIndex = 4;
              playAudio(currentAudioIndex);
              //console.log(`Playing sound from sequence 0 at index ${indexRef.current}`);
          }
          if (musicGrid[5] && musicGrid[5][indexRef.current]) {
              const currentAudioIndex = 5;
              playAudio(currentAudioIndex);
              //console.log(`Playing sound from sequence 1 at index ${indexRef.current}`);
          }
          if (musicGrid[6] && musicGrid[6][indexRef.current]) {
              const currentAudioIndex = 6;
              playAudio(currentAudioIndex);
              //console.log(`Playing sound from sequence 2 at index ${indexRef.current}`);
          }
          if (musicGrid[7] && musicGrid[7][indexRef.current]) {
              const currentAudioIndex = 7;
              playAudio(currentAudioIndex);
              //console.log(`Playing sound from sequence 3 at index ${indexRef.current}`);
          }
          indexRef.current++;
      }
  }

  useEffect(() => { 
      // Load all audio files when component mounts
      loadAudio();

      audioContext.suspend();

      let interval = setInterval(soundLoop, refreshRate);

      setDelay(prevDelay => (60.0/Tempo));
      return () => {
          setIsPlaying(false);
          audioContext.close();
          audioContext = new AudioContext();
          out = audioContext.destination;
          audioBuffers = []; // Reset audio buffers
          
          clearInterval(interval);
      }
  }, [delay, musicGrid, Tempo]);

  const handleTempoChange = (e) => {
    setTempo(e.target.value);
  };
  
  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };
  const changeGrid = (x, y) => {
    const newMusicGrid = musicGrid.map(row => [...row]);
    newMusicGrid[x][y] = !newMusicGrid[x][y];
    setMusicGrid(newMusicGrid);
    console.log(newMusicGrid);
  }

  const addColumn = () => {
    const newMusicGrid = musicGrid.map(row => [...row]);
    newMusicGrid.forEach(row => row.push(false));
    setColumns(columns => columns + 1);
    setMusicGrid(newMusicGrid);
  };

  const removeColumn = () => {
    const newMusicGrid = musicGrid.map(row => [...row]);
    newMusicGrid.forEach(row => row.pop());
    setColumns(columns => columns - 1);
    setMusicGrid(newMusicGrid);
  };

  return (
    <>
      <div className="main-container">
        <div className="music-grid">
          <div className="grid-container">
            {[...Array(8)].map((x, i) => (
              <div key={"row" + i} className="grid-row">
                <img src={`/${i + 1}.png`} className="soundIcon"></img>
                {[...Array(columns)].map((x2, i2) => (
                  <div
                    className={`grid-item ${musicGrid[i][i2] ? "clicked" : ""}`}
                    key={"row" + i + "item" + i2}
                    onClick={() => changeGrid(i, i2)}
                  ></div>
                ))}
              </div>
            ))}
          </div>
          <div className="grid-options">
            <button className="add" onClick={addColumn}>
              <MdAdd />
            </button>
            <button className="remove" onClick={removeColumn}>
              <MdOutlineRemove />
            </button>
          </div>
        </div>
        <div className="sliders">
          <div className="slider-container">
            <label htmlFor="tempo-slider">Tempo: {Tempo} BPM</label>
            <input
              id="tempo-slider"
              type="range"
              min={120}
              max={400}
              value={Tempo}
              onChange={handleTempoChange}
              className="slider"
            />
          </div>

          <div className="slider-container">
            <label htmlFor="volume-slider">Volume: {Volume}</label>
            <input
              id="volume-slider"
              type="range"
              min={0}
              max={100}
              value={Volume}
              onChange={handleVolumeChange}
              className="slider"
            />
          </div>
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
      </div>
    </>
  );
}

export default App;
