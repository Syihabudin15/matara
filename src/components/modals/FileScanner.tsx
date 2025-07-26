"use client";

import { CameraOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import jsPDF from "jspdf";
import moment from "moment";
import { useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import "moment/locale/id"; // Impor locale Indonesia

moment.locale("id"); // Set locale ke Indonesia

export default function FileScanner({
  geo,
  filename,
}: {
  geo?: boolean;
  filename: string;
}) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageCaptured, setImageCaptured] = useState(false);
  const user = useUser();

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

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    applyFilter("bright");
    if (geo) {
      addGeo();
    }
    setImageCaptured(true);
    stopCamera();
  };

  const applyFilter = (type: string) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const avg = (r + g + b) / 3;

      if (type === "grayscale") {
        data[i] = data[i + 1] = data[i + 2] = avg;
      } else if (type === "binary") {
        const bin = avg > 127 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = bin;
      } else if (type === "bright") {
        data[i] = Math.min(r + 50, 255);
        data[i + 1] = Math.min(g + 50, 255);
        data[i + 2] = Math.min(b + 50, 255);
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  const exportToPDF = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL("image/jpeg");
    const pdf = new jsPDF("p", "px", [canvas.width, canvas.height], true);
    pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
    pdf.save("File.pdf");
    // const pdfBlob = pdf.output("blob");
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

  const addGeo = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const paddingX = 20;
    const backgroundHeight = 100;
    const fontSize = 20;

    // Posisi Y latar belakang dan teks
    const yStart = canvas.height - backgroundHeight;

    // Latar belakang transparan hitam
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, yStart, canvas.width, backgroundHeight);

    // Set font dan warna teks
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = "white";

    // Teks baris 1
    ctx.fillText(
      `${moment().format("dddd")} | ${moment().format("DD/MM/YYYY HH:mm")}`,
      paddingX,
      yStart + fontSize + 5
    );

    // Teks baris 2
    ctx.font = `normal ${fontSize - 5}px Cambria,serif`;
    ctx.fillText(user?.location || "", paddingX, yStart + fontSize * 2.5);
    ctx.fillText(
      `Lat ${user?.lat} | Lng ${user?.lng}`,
      paddingX,
      yStart + fontSize * 2.5 + 15
    );
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
        title={"SCAN " + filename}
        open={open}
        footer={[]}
        onCancel={() => {
          stopCamera();
          setImageCaptured(false);
          setOpen(false);
        }}
      >
        {!imageCaptured && (
          <div className="relative w-full max-w-md mx-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "100%", maxWidth: 500, borderRadius: 10 }}
            />

            <div className="absolute w-full flex justify-center bottom-4">
              <button
                onClick={captureImage}
                className="border bg-blue-500 text-gray-50 w-10 h-10 rounded-full"
              >
                <CameraOutlined />
              </button>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{
            display: imageCaptured ? "block" : "none",
            width: "100%",
            maxWidth: 500,
          }}
        />

        {imageCaptured && (
          <div className="flex justify-center mt-2">
            <Button type="primary" onClick={exportToPDF}>
              📄 Simpan PDF
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
