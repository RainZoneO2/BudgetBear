import { useEffect, useRef, useState } from "react";

const CameraPreview = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCapturedImage, setShowCapturedImage] = useState(false); // State for displaying the captured image at the top

  // Start the camera on component mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    startCamera();

    return () => {
      // Stop the camera stream on component unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

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
    }
  };

  const handleDone = () => {
    setShowCapturedImage(true); // Show the captured image at the top
  };

  const handleRetake = () => {
    setCapturedImage(null); // Reset captured image
    setShowCapturedImage(false); // Hide the image at the top
  };

  return (
    <div className="flex flex-col items-center justify-between h-[70vh] bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Display the captured image at the top */}
      {showCapturedImage && (
        <div className="w-full h-[20vh] bg-gray-200 dark:bg-gray-800 mb-4">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Video Preview */}
      <div className="flex justify-center items-center w-full max-w-lg aspect-[3/4] bg-black rounded-lg overflow-hidden">
        {!capturedImage && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        {capturedImage && !showCapturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Capture Button and Done/Retake Buttons */}
      <div className="flex space-x-4 mt-4 mb-6">
        <button
          onClick={handleCapture}
          className="px-6 py-3 bg-sage-green text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
        >
          {capturedImage ? "Retake" : "Capture"}
        </button>
        {capturedImage && (
          <>
            <button
              onClick={handleDone}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
            >
              Done
            </button>
            <button
              onClick={handleRetake}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition"
            >
              Retake
            </button>
          </>
        )}
      </div>

      {/* Canvas (Hidden) */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraPreview;
