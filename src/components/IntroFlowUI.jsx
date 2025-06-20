// File: IntroFlowUI.jsx
import React, { useState } from 'react';

function IntroFlowUI({ user, prefs }) {
  const [name, setName] = useState(prefs.name || '');
  const [culture, setCulture] = useState(prefs.culture || '');
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step === 1) {
      const updatedPrefs = {
        ...prefs,
        name,
        culture,
        firstTime: false
      };
      window.electronAPI.updateUserPrefs(user, updatedPrefs);
      window.electronAPI.switchUser(user); // Trigger re-load into ChatUI
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {step === 0 && (
        <div>
          <h2>Hello! What’s your name?</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2>Thanks, {name}. Do you want to share your cultural or spiritual background?</h2>
          <textarea
            value={culture}
            onChange={(e) => setCulture(e.target.value)}
            placeholder="Optional background info"
          />
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleNext}>Begin</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IntroFlowUI;
