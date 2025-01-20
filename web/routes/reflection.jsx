import { useState, useRef, useEffect } from "react";
import { Mic, AudioLines } from "lucide-react";

const LiveTranscription = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [stream, setStream] = useState(null); // State to store the microphone stream
  const [micPosition, setMicPosition] = useState("center"); // Mic position state
  const [micSize, setMicSize] = useState("large"); // Mic size state
  const [silenceTimer, setSilenceTimer] = useState(null); // Timer to detect silence
  const recognition = useRef(null);

  // Request microphone permission and start listening
  const requestMicrophonePermission = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(newStream); // Save the stream to state
      console.log("Microphone access granted.");
      return true;
    } catch (error) {
      console.error("Error accessing the microphone:", error);
      alert("Microphone access is required to proceed.");
      return false;
    }
  };

  // Start or stop the speech recognition and microphone stream
  const handleClick = async () => {
    if (isListening) {
      // Stop recognition if it's currently listening
      recognition.current.stop();

      // Stop the microphone stream if it's active
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop()); // Stop all tracks (audio)
        console.log("Microphone stopped.");
      }
    } else {
      // Request permission and start the microphone stream
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) return; // Exit if permission is denied

      // Start recognition if permission is granted
      recognition.current.start();
    }

    // Toggle the listening state
    setIsListening((prev) => !prev);
  };

  // Handle silence detection
  const handleSilence = () => {
    if (silenceTimer) {
      clearTimeout(silenceTimer); // Clear the previous timer
    }

    // Set a new timer for 2 seconds of silence
    const timer = setTimeout(() => {
      if (isListening) {
        // Stop the recognition and move the mic to the bottom center
        recognition.current.stop();
        setIsListening(false);
        setMicPosition("bottom-center");
        setMicSize("small");
      }
    }, 2000); // 2 seconds of silence
    setSilenceTimer(timer);
  };

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    // Set up the speech recognition API
    recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.current.continuous = true;  // Keep listening until stopped
    recognition.current.interimResults = true;  // Show interim results (not finalized)
    recognition.current.lang = "en-US";  // Set the language to English

    // Handle the result when speech is transcribed
    recognition.current.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Update the transcript (final and interim text)
      setTranscript(finalTranscript || interimTranscript);

      // Handle silence detection
      handleSilence(); // Reset the silence timer when speech is detected
    };

    // Handle any errors
    recognition.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  }, [isListening]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative flex items-center justify-center">
        {/* Live sound waves effect */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-[#8aaf9c]/30 animate-wave"></div>
            <div className="absolute inset-0 rounded-full bg-[#8aaf9c]/20 animate-wave delay-150"></div>
            <div className="absolute inset-0 rounded-full bg-[#8aaf9c]/10 animate-wave delay-300"></div>
          </>
        )}

        {/* Main button */}
        <button
          onClick={handleClick}
          className={`relative z-10 flex items-center justify-center rounded-full bg-[#8aaf9c] shadow-lg transition-transform hover:scale-110 p-5 ${micPosition === "bottom-center" ? "fixed bottom-4 left-1/2 transform -translate-x-1/2" : ""} ${micSize === "small" ? "scale-50" : "scale-100"}`}
        >
          {isListening ? (
            <AudioLines size={64} className="text-white animate-pulse" />
          ) : (
            <Mic size={64} className="text-white" />
          )}
        </button>
      </div>

      {/* Status text */}
      <p className="mt-4 text-lg text-gray-600">
        {isListening ? "Listening... (live)" : "Tap to speak"}
      </p>

      {/* Live Transcript */}
      <div className="mt-4 w-full p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
        <p className="text-xl text-gray-800 dark:text-white">{transcript || "Waiting for speech..."}</p>
      </div>

      {/* Custom styles */}
      <style>
        {`
          @keyframes wave {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }
          .animate-wave {
            animation: wave 2s infinite;
          }
          .delay-150 {
            animation-delay: 0.15s;
          }
          .delay-300 {
            animation-delay: 0.3s;
          }
        `}
      </style>
    </div>
  );
};

export default LiveTranscription;
