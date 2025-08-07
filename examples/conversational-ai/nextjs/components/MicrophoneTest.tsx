
"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export function MicrophoneTest() {
  const [status, setStatus] = useState<string>("Not tested");
  const [isRecording, setIsRecording] = useState(false);

  const testMicrophone = async () => {
    try {
      setStatus("Requesting permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus("✅ Microphone permission granted!");
      setIsRecording(true);
      
      // Stop after 2 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setStatus("✅ Microphone test completed successfully");
      }, 2000);
    } catch (error: any) {
      console.error("Microphone test failed:", error);
      setStatus(`❌ Failed: ${error.name} - ${error.message}`);
      setIsRecording(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">🎤 Microphone Test</h3>
      <p className="text-sm text-gray-600 mb-3">
        Test if your browser can access the microphone
      </p>
      <div className="flex items-center gap-3">
        <Button 
          onClick={testMicrophone} 
          disabled={isRecording}
          size="sm"
        >
          {isRecording ? "Recording..." : "Test Microphone"}
        </Button>
        <span className="text-sm">{status}</span>
      </div>
    </div>
  );
}
