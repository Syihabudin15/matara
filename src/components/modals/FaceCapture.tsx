"use client";
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

interface FaceCaptureProps {
  mode: "register" | "login";
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Memuat model...");

  useEffect(() => {
    const MODEL_URL = "/models";
    (async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setStatus("");
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => setStatus("Tidak bisa akses kamera: " + err));
    })();
  }, []);

  const captureFace = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setStatus("Wajah tidak terdeteksi.");
      return;
    }
    const descriptor = Array.from(detection.descriptor);
    console.log({ descriptor, detection });
    // const endpoint = mode === "register" ? "/api/face/save" : "/api/face/login";

    // const response = await fetch(endpoint, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ descriptor }),
    // });

    // const result = await response.json();
    setStatus("WajahTerdeteksi");
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted width={320} height={240} />
      <button onClick={captureFace}>
        {mode === "register" ? "Daftarkan Wajah" : "Login dengan Wajah"}
      </button>
      <p>{status}</p>
    </div>
  );
};

export default FaceCapture;
