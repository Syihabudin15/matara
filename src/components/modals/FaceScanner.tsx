"use client";

import { Button, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Users } from "@prisma/client";

export default function FaceScanner({
  mode,
  setFace,
  isOpen,
  user,
}: {
  mode: "Login" | "Register";
  setFace: Function;
  isOpen: boolean;
  user: Users;
}) {
  const [open, setOpen] = useState(false);
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
      if (mode === "Login" && isOpen) {
        setOpen(true);
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
      setStatus("Scanning...");
      if (mode === "Register") {
        stopVideo();
        setStatus("Face Terdeteksi");
        setFace(descriptor);
        setOpen(false);
      } else {
        await fetch("/api/auth", {
          method: "PUT",
          headers: { "Content-type": "Application/json" },
          body: JSON.stringify({ userId: user.id, descriptor: descriptor }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.status !== 200) {
              setStatus(`Wajah ${user.fullname} Terdeteksi`);
            } else {
              stopVideo();
              setOpen(false);
              window && window.location.replace("/dashboard");
            }
          })
          .catch((err) => {
            console.log(err);
            setStatus(err);
          });
      }
      setLoading(false);
    } else {
      setStatus("Tidak terdeteksi!");
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
      {mode === "Register" && (
        <div className="flex items-center justify-between gap-2">
          <p className="w-42">Face Regognation</p>
          <Button
            onClick={() => {
              setOpen(true);
              startVideo();
            }}
            loading={loading}
            type="primary"
            size="small"
          >
            Scan Face
          </Button>
        </div>
      )}
      <Modal
        title={status}
        open={open}
        closable={false}
        footer={[]}
        loading={loading}
      >
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
      </Modal>
    </div>
  );
}
