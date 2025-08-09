import { useState } from "react";
import { MdAdd, MdOutlineRemove, MdPlayArrow } from "react-icons/md";
import "./App.css";

function App() {
  const [Tempo, setTempo] = useState(120);
  const [Volume, setVolume] = useState(80);
  const [musicGrid, setMusicGrid] = useState(Array.from({ length: 6 }, () => Array(8).fill(false)));
  const [columns, setColumns] = useState(8);
  const [isPlaying, setPlaying] = useState(false);

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
            {[...Array(6)].map((x, i) => (
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
              min={60}
              max={200}
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
          <button className="play">
            <MdPlayArrow/>
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
