"use client";

import {
  LoginOutlined,
  SecurityScanOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthType, Users } from "@prisma/client";
import { Button, Form, Input } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import FaceCapture from "@/components/modals/FaceCapture";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [openFace, setOpenFace] = useState(false);
  const [err, setErr] = useState<string>();
  const router = useRouter();
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
          router.push("/dashboard");
          window.location.reload();
        }
      })
      .catch((err) => {
        setErr(err);
      });
    setLoading(false);
  };

  const handleScanFace = async (descriptor: number[]) => {
    if (!user) return;
    setLoading(true);
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({ userId: user.id, descriptor: descriptor }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== 200) {
          setLoading(false);
          return setErr(err);
        } else {
          router.push("/dashboard");
          window.location.reload();
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
            router.push("/dashboard");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Error");
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
        <FaceCapture
          mode="login"
          setFace={(e: number[]) => handleScanFace(e)}
        />
      )}
    </div>
  );
}
