import { useState, useRef } from "react";

const TextAreaSpeechInput = ({
  label,
  value,
  onChange,
  onAudioCapture,

  placeholder = "",
  required = false,
  rows = 4,

  question = null,

  voiceOnly = false,

  hideVoice = false
}) => {

  const [isListening, setIsListening] =
    useState(false);

  const recognitionRef =
    useRef(null);

  const mediaRecorderRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  // =====================================================
  // START LISTENING
  // =====================================================

  const startListening = async () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Speech Recognition not supported"
      );

      return;
    }

    // ============================================
    // AUDIO RECORDING
    // ============================================

    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    const mediaRecorder =
      new MediaRecorder(stream);

    mediaRecorderRef.current =
      mediaRecorder;

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable =
      (event) => {

        if (event.data.size > 0) {

          audioChunksRef.current.push(
            event.data
          );
        }
      };

    mediaRecorder.onstop = () => {

      const audioBlob =
        new Blob(
          audioChunksRef.current,
          {
            type: "audio/webm"
          }
        );

      const audioFile =
        new File(

          [audioBlob],

          `audio_${Date.now()}.webm`,

          {
            type: "audio/webm"
          }
        );

      // IMPORTANT

      if (onAudioCapture) {

        onAudioCapture(audioFile);
      }
    };

    mediaRecorder.start();

    // ============================================
    // SPEECH RECOGNITION
    // ============================================

    const recognition =
      new SpeechRecognition();

    recognitionRef.current =
      recognition;

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";

    recognition.onstart = () => {

      setIsListening(true);
    };

    recognition.onresult = (event) => {

      let transcript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {

        transcript +=
          event.results[i][0].transcript + " ";
      }

      onChange(transcript);
    };

    recognition.onerror = () => {

      setIsListening(false);
    };

    recognition.onend = () => {

      setIsListening(false);

      mediaRecorder.stop();
    };

    recognition.start();
  };

  // =====================================================
  // MIC CLICK
  // =====================================================

  const handleMicClick = () => {

    // STOP

    if (isListening) {

      recognitionRef.current?.stop();

      mediaRecorderRef.current?.stop();

      setIsListening(false);

      return;
    }

    window.speechSynthesis.cancel();

    if (question) {

      const utterance =
        new SpeechSynthesisUtterance(
          question
        );

      utterance.lang = "en-US";

      utterance.rate = 1;

      utterance.onend = () => {

        startListening();
      };

      speechSynthesis.speak(
        utterance
      );

    } else {

      startListening();
    }
  };

  // =====================================================
  // TEXT CHANGE
  // =====================================================

  const handleTextChange = (
    event
  ) => {

    if (voiceOnly) return;

    onChange(event.target.value);
  };

  return (

    <div className="textarea-speech-input-container">

      <label className="speech-label">

        {label}

        {required && (
          <span className="required-asterisk">
            *
          </span>
        )}

      </label>

      <div className="textarea-wrapper">

        <textarea
          value={value}
          onChange={handleTextChange}
          rows={rows}
          readOnly={voiceOnly}
          className="speech-textarea"
          placeholder={
            voiceOnly
              ? "Click microphone and speak..."
              : placeholder
          }
        />

        {!hideVoice && (

          <button
            type="button"
            onClick={handleMicClick}
            className={`
              mic-button-textarea
              ${isListening ? "listening" : ""}
            `}
          >

            {isListening
              ? "🔴"
              : "🎤"}

          </button>

        )}

      </div>

    </div>
  );
};

export default TextAreaSpeechInput;

