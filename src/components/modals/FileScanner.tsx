"use client";

import { CameraOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";

export default function FileScanner() {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageCaptured, setImageCaptured] = useState(false);

  // useEffect(() => {
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  //   startCamera();
  // }, []);

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    applyFilter(ctx, canvas);
    setImageCaptured(true);
  };

  const applyFilter = (ctx: any, canvas: any) => {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Grayscale + high contrast (binary)
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const bin = avg > 127 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = bin;
    }

    ctx.putImageData(imgData, 0, 0);
  };

  const exportToPDF = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL("image/jpeg");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height / canvas.width) * 210;
    pdf.addImage(imgData, "JPEG", 0, 0, width, height);
    pdf.save("scan.pdf");
  };
  const stopCamera = () => {
    if (!videoRef.current) return;
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  return (
    <div>
      <Button
        icon={<CameraOutlined />}
        onClick={() => {
          setOpen(true);
          startCamera();
        }}
        size="small"
      ></Button>
      <Modal
        title={"Scan File"}
        open={open}
        footer={[]}
        onCancel={() => {
          stopCamera();
          setOpen(false);
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", maxWidth: 500, borderRadius: 10 }}
        />

        <br />
        <button onClick={captureImage}>📸 Capture</button>

        <br />
        <br />
        <canvas
          ref={canvasRef}
          style={{
            display: imageCaptured ? "block" : "none",
            width: "100%",
            maxWidth: 500,
          }}
        />

        <br />
        {imageCaptured && (
          <button onClick={exportToPDF}>📄 Simpan ke PDF</button>
        )}
      </Modal>
    </div>
  );
}
