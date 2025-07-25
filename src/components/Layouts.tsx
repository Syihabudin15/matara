"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import { App } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { MenuLayout } from "./utils/MenuLayout";
import { Notification } from "./utils/NotifInfo";
import Image from "next/image";
import { UserProvider } from "./context/UserContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [alowed, setAlowed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);

      const res = await fetch("/api/auth/device", { method: "DELETE" });
      const response = await res.json();
      if (response.status !== 200) {
        setAlowed(false);
      } else {
        setAlowed(true);
      }
      setLoading(false);
    })();
  }, []);
  return (
    <App style={{ fontFamily: "JetBrains Mono" }}>
      <UserProvider>
        {loading ? (
          <div>
            DEVICE VERIFICATION... <LoadingOutlined />
          </div>
        ) : (
          <div>
            {alowed ? (
              <AntdRegistry>
                <div className="flex justify-between py-2 px-5 items-center bg-gradient-to-br to-blue-500 from-purple-500">
                  <div className="flex gap-2 items-center">
                    <Image
                      src={process.env.NEXT_PUBLIC_APP_LOGO || "/vercel.svg"}
                      width={30}
                      height={30}
                      alt="App Logo"
                    />
                    <h1 className="font-bold text-lg text-white text-shadow-2xs">
                      {process.env.NEXT_PUBLIC_APP_SHORTNAME || "APPName"}
                    </h1>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="hidden sm:block">
                      <Notification />
                    </div>
                    <MenuLayout />
                  </div>
                </div>
                {children}
              </AntdRegistry>
            ) : (
              <div className="text-red-500 font-bold text-2xl text-center flex justify-center items-center h-[100vh]">
                DEVICE INI TIDAK DIIZINKAN UNTUK MASUK KE DALAM SISTEM KAMI!
              </div>
            )}
          </div>
        )}
      </UserProvider>
    </App>
  );
}
