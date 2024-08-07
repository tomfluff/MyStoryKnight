/*
 * Custom hook to use webcam and capture content.
 * It returns the webcamRef and the base64Capture.
 *
 * @example
 * const { webcamRef, base64Capture, captureWebcam } = useWebcam();
 * <Webcam ref={webcamRef} />
 * <button onClick={() => captureWebcam()}>Capture</button>
 *
 */
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

const useMotionCapture = () => {
  const webcamRef = useRef<Webcam>(null);
  const [base64Capture, setBase64Capture] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const chunks = useRef<Blob[]>([]);

  // Capture photo from webcam
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const captured = webcamRef.current.getScreenshot();
      setBase64Capture(captured);
    }
  }, [webcamRef]);

  const clear = useCallback(() => {
    setBase64Capture(null);
    setVideoBlob(null);
    chunks.current = [];
  }, []);

  const startRecording = useCallback(() => {
    console.log("Start recording");
    if (webcamRef.current && webcamRef.current.video) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/mp4" });
        console.log("Video blob:", blob);
        setVideoBlob(blob);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  }, [webcamRef]);

  const stopRecording = useCallback(() => {
    console.log("Stop recording");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return { 
    webcamRef, 
    base64Capture, 
    videoBlob, 
    capture, 
    clear, 
    startRecording, 
    stopRecording, 
    isRecording 
  };
};

export default useMotionCapture;
