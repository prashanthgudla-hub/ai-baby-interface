import { useState, useRef, useEffect } from 'react';
import './index.css';

function App() {
  const [age, setAge] = useState(1);
  const [happiness, setHappiness] = useState(80);
  const [sleepiness, setSleepiness] = useState(20);
  
  // Mouse tracking state for 3D tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate mouse position relative to the center of the baby image (-1 to 1)
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getBabyScale = () => {
    return 0.8 + (age * 0.05);
  };

  const getBabyFilter = () => {
    if (sleepiness > 80) return 'brightness(0.8) sepia(0.2)';
    if (happiness > 80) return 'brightness(1.1) saturate(1.2)';
    return 'none';
  };

  // Calculate the 3D transform based on mouse position
  const tiltX = -mousePos.y * 15; // Max 15 degrees tilt
  const tiltY = mousePos.x * 15;

  return (
    <div className="app-container">
      <div className="glass-panel main-panel">
        <header>
          <h1>AI Baby Interface</h1>
          <p>Interact with your virtual companion</p>
        </header>

        <div className="baby-display-area" ref={containerRef}>
          <div className="baby-stage">
            <div 
              className={`baby-anim-wrapper ${sleepiness > 80 ? 'sleepy' : ''} ${happiness > 80 ? 'happy' : 'breathing'}`}
              style={{
                transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${getBabyScale()})`
              }}
            >
              <img 
                src="/baby_character.png" 
                alt="AI Baby" 
                className="baby-image"
                style={{ filter: getBabyFilter() }} 
              />
            </div>
          </div>
          
          <div className="status-indicators">
            <div className="status-badge">
              <span className="icon">👶</span> Age: {age} month{age > 1 ? 's' : ''}
            </div>
            <div className="status-badge">
              <span className="icon">😊</span> Mood: {happiness > 70 ? 'Happy' : happiness < 30 ? 'Crying' : 'Calm'}
            </div>
            <div className="status-badge">
              <span className="icon">💤</span> Energy: {100 - sleepiness}%
            </div>
          </div>
        </div>

        <div className="controls-area">
          <div className="control-group">
            <label>
              Age (Months)
              <span className="value-display">{age}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="12" 
              value={age} 
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="slider slider-age"
            />
          </div>

          <div className="control-group">
            <label>
              Happiness
              <span className="value-display">{happiness}%</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={happiness} 
              onChange={(e) => setHappiness(parseInt(e.target.value))}
              className="slider slider-happy"
            />
          </div>

          <div className="control-group">
            <label>
              Sleepiness
              <span className="value-display">{sleepiness}%</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sleepiness} 
              onChange={(e) => setSleepiness(parseInt(e.target.value))}
              className="slider slider-sleep"
            />
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="btn btn-feed" onClick={() => { setHappiness(Math.min(100, happiness + 20)); setSleepiness(Math.min(100, sleepiness + 10)); }}>
            🍼 Feed
          </button>
          <button className="btn btn-play" onClick={() => { setHappiness(Math.min(100, happiness + 30)); setSleepiness(Math.min(100, sleepiness + 30)); }}>
            🧸 Play
          </button>
          <button className="btn btn-sleep" onClick={() => { setSleepiness(0); setHappiness(Math.min(100, happiness + 10)); }}>
            🛏️ Sleep
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
