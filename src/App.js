import React, { useState, useEffect } from 'react';
import './App.css';

const ROWS = 20;
const COLS = 15;
const DROP_LENGTH = 6;
const DROPS_PER_TICK = 2;
const DROP_PROBABILITY = 0.6;

const COLOR_PALETTES = [
  ['#00f', '#4B0082'],
  ['#ff0040', '#ff6b9d'],
  ['#00ff00', '#39ff14'],
  ['#ffaa00', '#ff6600'],
  ['#00ffff', '#0080ff'],
  ['#ff00ff', '#8000ff'],
  ['#ffff00', '#ffd700'],
];

const createEmptyGrid = () =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => '#111')
  );

function App() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [currentPalette, setCurrentPalette] = useState(COLOR_PALETTES[0]);

  useEffect(() => {
    const colorInterval = setInterval(() => {
      const newPalette =
        COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
      setCurrentPalette(newPalette);
    }, 4000);
    return () => clearInterval(colorInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prevGrid => {
        const nextGrid = createEmptyGrid();

        // Move existing colors down
        for (let r = ROWS - 2; r >= 0; r--) {
          for (let c = 0; c < COLS; c++) {
            const color = prevGrid[r][c];
            if (color && color !== '#111') {
              nextGrid[r + 1][c] = color;
            }
          }
        }

        // Add new drops
        for (let d = 0; d < DROPS_PER_TICK; d++) {
          if (Math.random() > DROP_PROBABILITY) continue;

          const col = Math.floor(Math.random() * COLS);
          const baseColor =
            currentPalette[Math.floor(Math.random() * currentPalette.length)];

          for (let i = 0; i < DROP_LENGTH; i++) {
            const fade = 1 - i / DROP_LENGTH;
            const rgba = hexToRgba(baseColor, fade);
            const row = i;
            if (row < ROWS) {
              nextGrid[row][col] = rgba;
            }
          }
        }

        return nextGrid;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [currentPalette]);

  function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <>
      <div className="background">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDuration: `${4 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 10}s`,
              fontSize: `${Math.random() * 20 + 20}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      <div className="container">
        <h1 className="title">Qurious Rainfall</h1>
        <div className="grid">
          {grid.map((row, rIdx) =>
            row.map((color, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className="cell"
                style={{ backgroundColor: color }}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
