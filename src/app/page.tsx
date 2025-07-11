"use client";
import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Button, Modal } from "antd";
import FaceCapture from "@/components/modals/FaceCapture";

export default function Home() {
  const [open, setOpen] = useState(false);
  // const [data, setData] = useState();
  useEffect(() => {
    (async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      console.log({ id: result.visitorId });
    })();
  }, []);
  return (
    <div>
      <div>HOME</div>
      <Button onClick={() => setOpen(true)}>Login</Button>
      <Modal open={open} title="Pengenalan Wajah">
        <FaceCapture mode="register" />
      </Modal>
    </div>
  );
}
