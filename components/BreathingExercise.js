import { useState, useEffect } from 'react';

export default function BreathingExercise() {
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  
  // Configure breathing pattern
  const breathingPattern = {
    inhale: { duration: 4, nextPhase: 'hold' },
    hold: { duration: 4, nextPhase: 'exhale' },
    exhale: { duration: 6, nextPhase: 'inhale' },
  };
  
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (count === 1) {
          // Move to next phase
          setPhase(breathingPattern[phase].nextPhase);
          setCount(breathingPattern[breathingPattern[phase].nextPhase].duration);
        } else {
          setCount(count - 1);
        }
      }, 1000);
    } else {
      // Reset when paused
      clearInterval(interval);
      setPhase('inhale');
      setCount(breathingPattern.inhale.duration);
    }
    
    return () => clearInterval(interval);
  }, [isActive, phase, count]);
  
  const toggleExercise = () => {
    setIsActive(!isActive);
  };
  
  const getCircleStyles = () => {
    let scale = 1;
    
    if (phase === 'inhale') {
      // Scale from 1 to 1.5 during inhale
      scale = 1 + (0.5 * (breathingPattern.inhale.duration - count)) / breathingPattern.inhale.duration;
    } else if (phase === 'hold') {
      scale = 1.5; // Fully expanded during hold
    } else if (phase === 'exhale') {
      // Scale from 1.5 to 1 during exhale
      scale = 1.5 - (0.5 * (breathingPattern.exhale.duration - count)) / breathingPattern.exhale.duration;
    }
    
    return {
      transform: `scale(${scale})`,
      transition: 'transform 1s linear',
    };
  };
  
  const getInstructionText = () => {
    if (!isActive) return 'Press start to begin';
    return phase.charAt(0).toUpperCase() + phase.slice(1);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8">
        <div 
          className="w-64 h-64 rounded-full bg-blue-100 flex items-center justify-center"
          style={getCircleStyles()}
        >
          <div className="text-center">
            <div className="text-2xl font-medium text-blue-800">
              {getInstructionText()}
            </div>
            {isActive && <div className="text-5xl font-bold text-blue-600 mt-2">{count}</div>}
          </div>
        </div>
      </div>
      
      <button
        onClick={toggleExercise}
        className={`px-6 py-3 rounded-lg font-medium ${
          isActive 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isActive ? 'Stop' : 'Start'}
      </button>
      
      <div className="mt-8 text-center text-gray-600 max-w-md">
        <h3 className="font-medium text-lg mb-2">Instructions</h3>
        <p className="mb-2">Find a comfortable position. As the circle expands, breathe in deeply through your nose. Hold your breath when the circle pauses. Exhale slowly through your mouth as the circle contracts.</p>
        <p>For best results, use this exercise for 3-5 minutes whenever you need to reduce stress or anxiety.</p>
      </div>
    </div>
  );
}

