import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Web Speech API for Baby Voice
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.8; // High pitch for baby voice
      utterance.rate = 1.1;
      
      // Try to find a friendly female/child voice if available
      const voices = window.speechSynthesis.getVoices();
      const childVoice = voices.find(v => v.name.toLowerCase().includes('child') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira'));
      if (childVoice) {
        utterance.voice = childVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFeed = () => {
    setHappiness(prev => Math.min(100, prev + 20));
    setSleepiness(prev => Math.min(100, prev + 10));
    speak('Yummy! Thank you!');
  };

  const handlePlay = () => {
    const newHappy = Math.min(100, happiness + 30);
    setHappiness(newHappy);
    setSleepiness(prev => Math.min(100, prev + 30));
    speak('Weee! This is fun!');
    
    if (newHappy === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff69b4', '#8a2be2', '#00d2ff', '#fbbf24']
      });
    }
  };

  const handleSleep = () => {
    setSleepiness(0);
    setHappiness(prev => Math.min(100, prev + 10));
    speak('Yawn... Goodnight...');
  };

  const getBabyScale = () => {
    return 0.8 + (age * 0.05);
  };

  const getBabyFilter = () => {
    if (sleepiness > 80) return 'brightness(0.7) sepia(0.3) hue-rotate(-20deg)';
    if (happiness > 80) return 'brightness(1.1) saturate(1.3)';
    return 'none';
  };

  const tiltX = -mousePos.y * 15;
  const tiltY = mousePos.x * 15;

  // Dynamic Background classes based on state
  const getBackgroundClass = () => {
    if (sleepiness > 80) return 'bg-night';
    if (happiness > 80) return 'bg-happy';
    return 'bg-day';
  };

  return (
    <div className={`app-wrapper ${getBackgroundClass()}`}>
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
                  src={`${import.meta.env.BASE_URL}baby_character.png`} 
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
            <button className="btn btn-feed" onClick={handleFeed}>
              🍼 Feed
            </button>
            <button className="btn btn-play" onClick={handlePlay}>
              🧸 Play
            </button>
            <button className="btn btn-sleep" onClick={handleSleep}>
              🛏️ Sleep
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
