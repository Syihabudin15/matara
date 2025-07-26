import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layouts";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App } from "antd";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${process.env.NEXT_PUBLIC_APP_SHORTNAME}`,
    template: `%s | ${process.env.NEXT_PUBLIC_APP_SHORTNAME}`,
  },
  description: "Sistem Informasi Pensiunan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.variable} antialiased`}>
        <App>
          <AntdRegistry>
            <Layout>{children}</Layout>
          </AntdRegistry>
        </App>
      </body>
    </html>
  );
}
