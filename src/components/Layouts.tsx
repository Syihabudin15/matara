"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import { App } from "antd";
import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { LoadingOutlined } from "@ant-design/icons";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [alowed, setAlowed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const devices: string[] = ["c7ab10d69173865903d6bd14d85a17c3", "123"];
  useEffect(() => {
    (async () => {
      setLoading(true);
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      console.log({ id: result.visitorId });
      if (!devices.includes(result.visitorId)) {
        setAlowed(false);
      } else {
        setAlowed(true);
      }
      setLoading(false);
    })();
  }, []);
  return (
    <App>
      {loading ? (
        <div>
          DEVICE VERIFICATION... <LoadingOutlined />
        </div>
      ) : (
        <div>
          {alowed ? (
            <AntdRegistry>{children}</AntdRegistry>
          ) : (
            <div className="text-red-500 font-bold text-2xl text-center flex justify-center items-center h-[100vh]">
              DEVICE INI TIDAK DIIZINKAN UNTUK MASUK KE DALAM SISTEM KAMI!
            </div>
          )}
        </div>
      )}
    </App>
  );
}
