import React, { useState, useRef } from "react";

const JobAgent = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload-resume/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || "File uploaded successfully!");
      } else {
        setMessage("Failed to upload file. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Video Background */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
          onError={() => setVideoError(true)}
        >
          <source src="/background-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Fallback background */}
      {videoError && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-700 z-0" />
      )}

      {/* Main Container */}
      <div className="relative flex items-center justify-end w-full max-w-6xl z-20">
        {/* Upload Box - Moved to the right */}
        <div className="bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-lg ml-auto ">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            Upload Your Resume
          </h1>
          <div className="flex flex-col items-center space-y-6">
            {/* Upload Icon */}
            <div
              onClick={() => document.getElementById("file-upload").click()}
              className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx"
            />

            {/* Selected File Name */}
            {file && (
              <p className="text-sm text-gray-300">
                 <span className="font-medium">{file.name}</span>
              </p>
            )}

            {/* Send Button - Increased Width */}
            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-[#767CFF] text-white px-10 py-3 rounded-lg text-lg font-semibold hover:bg-[#767CFF] transition-colors disabled:bg-[#767CFF] disabled:cursor-not-allowed w-full"
              >
                {uploading ? "Sending..." : "Send"}
              </button>
            )}

            {/* Message */}
            {message && (
              <p className="text-sm text-center mt-4 text-gray-300">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAgent;
