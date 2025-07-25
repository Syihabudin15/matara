"use client";

import {
  LoadingOutlined,
  LoginOutlined,
  SecurityScanOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthType, Users } from "@prisma/client";
import { Button, Form, Input } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
const FaceCapture = dynamic(() => import("@/components/modals/FaceCapture"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [openFace, setOpenFace] = useState(false);
  const [err, setErr] = useState<string>();
  const [user, setUser] = useState<Users | undefined>();

  const handleSubmit = async (e: { username: string; password: string }) => {
    setLoading(true);
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify(e),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          setLoading(false);
          return setErr("Username atau password salah");
        }
        if (res.data.authType === AuthType.FACE) {
          setOpenFace(true);
          setUser(res.data);
        } else {
          window && window.location.replace("/dashboard");
        }
      })
      .catch((err) => {
        setErr(err);
      });
    setLoading(false);
  };

  const handleScanFace = async (descriptor: any) => {
    if (!user) return;
    setLoading(true);
    await fetch("/api/auth", {
      method: "PUT",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({ userId: user.id, descriptor: descriptor }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== 200) {
          setLoading(false);
          setOpenFace(true);
          return setErr(err);
        } else {
          window && window.location.replace("/dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
        setErr(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await fetch("/api/auth")
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            window && window.location.replace("/dashboard");
          }
          return;
        })
        .catch((err) => {
          console.log(err);
          alert("Error Login Page");
        });
    })();
  }, []);

  return (
    <div className="flex justify-center sm:justify-end items-center w-full h-[92vh] bg-gradient-to-br from-purple-500 to-orange-500">
      <div className="bg-slate-50 p-5 h-[50vh] sm:h-full w-[90vw] sm:w-[30vw] flex flex-col items-center justify-center gap-5">
        <Image
          src={process.env.nNEXT_PUBLIC_APP_LOGO || "/globe.svg"}
          alt="App Logo"
          width={50}
          height={50}
        />
        <div className="my-5 w-full">
          <Form
            layout="vertical"
            onChange={() => setErr(undefined)}
            onFinish={handleSubmit}
          >
            <Form.Item label="Username" required name={"username"}>
              <Input prefix={<UserOutlined />} required />
            </Form.Item>
            <Form.Item label="Password" required name={"password"}>
              <Input.Password prefix={<SecurityScanOutlined />} required />
            </Form.Item>
            {err && (
              <div className="italic text-red-500">
                <p>{err}</p>
              </div>
            )}
            <div>
              <Button
                block
                type="primary"
                icon={<LoginOutlined />}
                htmlType="submit"
                loading={loading}
              >
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
      {openFace && (
        <FaceCapture mode="login" setFace={(e: any) => handleScanFace(e)} />
      )}
    </div>
  );
}
