import { useState } from "react";

const SpeechInput = ({
  label,
  value,
  onChange,

  placeholder = "",
  required = false,
  type = "text",

  hideVoice = false
}) => {

  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  return (

    <div className="speech-input-container">

      <label className="speech-label">

        {label}

        {required && (
          <span className="required-asterisk">
            *
          </span>
        )}

      </label>

      <div className="speech-input-wrapper">

        <input
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="speech-input"
        />

        {!hideVoice && (

          <button
            type="button"
            className="mic-button"
          >
            🎤
          </button>

        )}

      </div>

    </div>
  );
};

export default SpeechInput;