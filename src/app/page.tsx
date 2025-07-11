"use client";
import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import FaceCapture from "@/components/modals/FaceCapture";

export default function Home() {
  return (
    <div>
      <FaceCapture mode="login" deviceId={null} />
    </div>
  );
}
