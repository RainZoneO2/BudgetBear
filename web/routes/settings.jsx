import React, { useState } from "react";
import { useSignOut } from "@gadgetinc/react";
import { api } from "../api";

const Settings = () => {
  const [reflectionType, setReflectionType] = useState("Weekly");
  const signOut = useSignOut(api);

  const handleReflectionToggle = () => {
    setReflectionType((prev) => (prev === "Weekly" ? "Monthly" : "Weekly"));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-gray-100 absolute top-0 left-0 w-full h-full"></div>
      <div className="relative w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>

        {/* Reflection Toggle */}
        <div className="flex items-center justify-between mb-6">
          <label htmlFor="reflection-toggle" className="text-lg font-medium">
            Reflection Frequency
          </label>
          <div
            className={`flex items-center cursor-pointer w-24 h-10 rounded-full p-1 transition ${
              reflectionType === "Weekly"
                ? "bg-blue-500 justify-start"
                : "bg-green-500 justify-end"
            }`}
            onClick={handleReflectionToggle}
          >
            <div className="w-8 h-8 bg-white rounded-full shadow"></div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mb-6">
          Current: <span className="font-medium">{reflectionType}</span>
        </p>

        {/* Sign Out Button */}
        <button
          onClick={signOut}
          className="w-full py-3 text-white bg-red-500 hover:bg-red-600 transition rounded-lg font-semibold text-lg"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
