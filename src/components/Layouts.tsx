"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import { App } from "antd";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <App>
      <AntdRegistry>{children}</AntdRegistry>
    </App>
  );
}
