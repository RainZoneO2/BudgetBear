import { useState } from "react";
import { Mic, AudioLines } from "lucide-react";
// import AudioRecorder from "../components/AudioRecorder.js"
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: 'apigsk_LadNqj85egLl7eT3y0bAWGdyb3FYTAbFSSHMTrkHSwEWCogl8Ges', dangerouslyAllowBrowser: true});

export default function() {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    setIsListening((prev) => !prev);
  };

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
          className="relative z-10 flex items-center justify-center rounded-full bg-[#8aaf9c] shadow-lg transition-transform hover:scale-110 p-5"
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
}

// import reactLogo from "../assets/react-logo.svg";

// export default function () {
//   return (
//     <>
//       <div className="font-[system-ui] font-bold text-[larger] gap-4 flex flex-col w-full">
//         <img
//           src={reactLogo}
//           className="h-20 my-0 mx-auto block pointer-events-none motion-safe:animate-app-logo-spin"
//           alt="logo"
//         />
//         <span>
//           You are now signed out of {process.env.GADGET_PUBLIC_APP_SLUG} &nbsp;
//         </span>
//       </div>
//       <div>
//         <p className="font-[250] mb-1.5">
//           Start building your app&apos;s signed out area
//         </p>
//         <a
//           href="/edit/files/frontend/routes/index.jsx"
//           target="_blank"
//           rel="noreferrer"
//           className="font-medium underline text-[#0000ee]"
//         >
//           frontend/routes/index.jsx
//         </a>
//       </div>
//     </>
//   );
// }
