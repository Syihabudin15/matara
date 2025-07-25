"use client";
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function FaceCapture({
  mode,
  setFace,
}: {
  mode: "login" | "register";
  setFace: Function;
}) {
  const [open, setOpen] = useState(mode === "login" ? true : false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Memuat model...");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const MODEL_URL = "/models";
    (async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setStatus("Verifikasi Wajah");
      if (mode === "login") {
        startVideo();
      }
    })();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        intervalRef.current = window.setInterval(detectFace, 500); // deteksi tiap 500ms
      })
      .catch((err) => setStatus("Tidak bisa akses kamera: " + err));
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const displaySize = {
      width: video.clientWidth,
      height: video.clientHeight,
    };

    canvas.width = displaySize.width;
    canvas.height = displaySize.height;

    faceapi.matchDimensions(canvas, displaySize);

    const detection = await faceapi
      .detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 416 })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (detection) {
      const resized = faceapi.resizeResults(detection, displaySize);
      faceapi.draw.drawDetections(canvas, resized);
      const descriptor = Array.from(detection.descriptor);
      setLoading(true);
      setStatus("Wajah terdeteksi");
      stopVideo();
      setFace(descriptor);
      setOpen(false);
      setLoading(false);
      // const endpoint = mode === "register" ? "/api/face/save" : "/api/auth";
      // if (mode === "login") {
      //   // const response = await fetch(endpoint, {
      //   //   method: "PUT",
      //   //   headers: { "Content-Type": "application/json" },
      //   //   body: JSON.stringify({ descriptor }),
      //   // });

      //   // const result = await response.json();
      //   // if (result.status === 200) {
      //   //   stopVideo();
      //   //   setStatus(`Wajah Dikenali ${result.data.fullname}`);
      //   //   setOpen(false);
      //   //   setFace();
      //   // } else {
      //   //   setStatus("Wajah Tidak Dikenali!");
      //   //   setLoading(false);
      //   //   startVideo();
      //   // }
      // } else {
      //   setFace(descriptor);
      //   stopVideo();
      //   setOpen(false);
      // }
    } else {
      setStatus("Wajah tidak terdeteksi");
    }
  };
  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div>
      {mode === "register" && (
        <Button
          type="primary"
          onClick={() => {
            startVideo();
            setOpen(true);
          }}
        >
          Scan Face
        </Button>
      )}
      <Modal
        open={open}
        footer={[]}
        title={status || "Verifikasi Wajah"}
        onCancel={() => {
          stopVideo();
          setOpen(false);
        }}
        closable={false}
      >
        {loading ? (
          <div>
            Wajah Sedang Di Verifikasi <LoadingOutlined />
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 3",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: "100%",
                height: "auto",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                borderRadius: "40%",
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "auto",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
