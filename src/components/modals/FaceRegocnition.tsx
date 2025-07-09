import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceRecognition() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState("Memuat model...");

  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]).then(startVideo);
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error(err));
    setStatus("Model siap.");
  };

  const getDescriptor = async () => {
    if (!videoRef.current) return null;
    console.log({ refference: videoRef.current });
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    console.log({ detection });
    return detection?.descriptor || null;
  };

  const handleRegister = async () => {
    const descriptor = await getDescriptor();
    if (!descriptor) return alert("Wajah tidak terdeteksi.");
    await fetch("/api/register-face", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "user1", descriptor }),
    });
    alert("Registrasi berhasil.");
  };

  const handleLogin = async () => {
    const descriptor = await getDescriptor();
    if (!descriptor) return alert("Wajah tidak terdeteksi.");
    const res = await fetch("/api/login-face", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descriptor }),
    });
    const data = await res.json();
    alert(data.success ? `Login Berhasil: ${data.name}` : "Login Gagal");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Login dengan Wajah</h1>
      <p>{status}</p>
      <div>
        <video
          id="video"
          autoPlay
          muted
          width="480"
          height="360"
          style={{ border: "1px solid gray" }}
          ref={videoRef}
        />
        <div
          style={{ marginTop: "10px" }}
          className="flex justify-between"
        ></div>
      </div>
      <button onClick={() => handleRegister()}>Register</button>
      <button onClick={() => handleLogin()}>Login</button>
    </div>
  );
}
