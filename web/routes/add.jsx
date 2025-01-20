import { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";

const CameraPreview = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [receiptData, setReceiptData] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);

  // Start the camera
  const startCamera = async (id = null) => {
  try {
    // Stop any existing stream before starting a new one
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    const constraints = id
      ? { video: { deviceId: { exact: id } } }
      : { video: { facingMode: "environment" } };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (error) {
    console.error("Error accessing the camera:", error);

    if (error.name === "OverconstrainedError" && id) {
      console.warn("Attempting to fallback to default camera...");
      await startCamera(); // Retry without deviceId
    }
  }
};

  // Fetch available video devices
  useEffect(() => {
    const getVideoDevices = async () => {
  try {
    // Ensure camera access before calling enumerateDevices
    await navigator.mediaDevices.getUserMedia({ video: true });

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputDevices = devices.filter((device) => device.kind === "videoinput");

    setVideoDevices(videoInputDevices);
    if (videoInputDevices.length > 0) {
      setDeviceId(videoInputDevices[0].deviceId);
    }
  } catch (error) {
    console.error("Error fetching video devices:", error);
  }
};

    getVideoDevices();
  }, []);

  // Restart camera whenever deviceId changes
  useEffect(() => {
  if (deviceId) { 
    startCamera(deviceId);
  }
  return () => stopStream(); // Clean up on unmount or deviceId change
}, [deviceId]);

  const handleFlipCamera = () => {
  if (videoDevices.length > 1) {
    const currentIndex = videoDevices.findIndex((device) => device.deviceId === deviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    
    // Set the next deviceId
    setDeviceId(videoDevices[nextIndex].deviceId);
  }
};

const stopStream = () => {
  if (videoRef.current && videoRef.current.srcObject) {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  }
};
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const video = videoRef.current;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Save the image as a data URL
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
      console.log("Image captured:", imageData); // Debugging log

      // Start OCR process
      processOCR(imageData);
    }
  };

  const processOCR = (imageData) => {
    // Use Tesseract.js to extract text from the image
    Tesseract.recognize(imageData, "eng", {
      logger: (m) => console.log(m), // Log OCR progress
    })
      .then(({ data: { text } }) => {
        console.log("Extracted text:", text); // Debugging log
        setExtractedText(text);
        parseReceiptData(text);
      })
      .catch((error) => {
        console.error("OCR error:", error);
      });
  };

  const parseReceiptData = (text) => {
    const lines = text.split("\n");

    const items = [];
    let currentItem = null;

    lines.forEach((line) => {
      // Simple heuristic: if the line contains a price (numeric value), treat it as an item
      const priceMatch = line.match(/\$?(\d+\.\d{2})/); // Match price like $12.34 or 12.34

      if (priceMatch) {
        if (currentItem) {
          items.push(currentItem); // Push the previous item
        }
        currentItem = {
          item: line.replace(priceMatch[0], "").trim(),
          price: priceMatch[0],
        };
      } else if (currentItem) {
        // If the line is part of the item's name, append it
        currentItem.item += " " + line.trim();
      }
    });

    if (currentItem) {
      items.push(currentItem); // Push the last item
    }

    setReceiptData(items);
    console.log("Parsed Receipt Data:", items);
  };

  return (
    <div className="flex flex-col items-center justify-between h-[70vh] bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Video Preview */}
      <div className="relative flex justify-center items-center w-full max-w-lg aspect-[3/4] bg-black rounded-lg overflow-hidden">
        {!capturedImage && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}

        {/* Flip Camera Button */}
        {!capturedImage && videoDevices.length > 1 && (
          <button
            onClick={handleFlipCamera}
            className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-600 transition"
          >
            Flip
          </button>
        )}
      </div>

      {/* Capture Button */}
      <button
        onClick={() => {
          if (capturedImage) {
            // Refresh the page to reset the state
            window.location.reload();
          } else {
            handleCapture();
          }
        }}
        className="mt-4 mb-6 px-6 py-3 bg-sage-green text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
      >
        {capturedImage ? "Retake" : "Capture"}
      </button>

      {/* Canvas (Hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Display Extracted Text */}
      <div className="mt-4 w-full p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
        <p className="text-xl text-gray-800 dark:text-white">
          {extractedText || "Waiting for receipt..."}
        </p>
      </div>

      {/* Display Parsed Receipt Data */}
      <div className="mt-4 w-full p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Receipt Items:
        </h3>
        <ul>
          {receiptData.map((item, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {item.item} - {item.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CameraPreview;
