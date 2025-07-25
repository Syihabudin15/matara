"use client";

import {
  CalculatorOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Menu, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Notification } from "./NotifInfo";
import { useUser } from "../context/UserContext";
import { IUser } from "../IInterface";

export const MenuLayout = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const router = useRouter();
  const user = useUser();

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth", { method: "DELETE" })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          setOpen(false);
          setModalLogout(false);
          window && window.location.replace("/");
        } else {
          alert(res.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error");
      });
    setLoading(false);
  };

  return (
    <div className={`${!user ? "hidden" : "block"}`}>
      <Button onClick={() => setOpen(true)} className="shadow">
        <MenuOutlined />
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width={window.innerWidth > 600 ? "30vw" : "80vw"}
        title="MAIN MENU"
      >
        {user && <UserBio user={user} />}
        <Menu
          mode="inline"
          items={[
            {
              label: "Dashboard",
              key: "/dashboard",
              icon: <DashboardOutlined />,
            },
            {
              label: "Simulasi Kredit",
              key: "/simulasi",
              icon: <CalculatorOutlined />,
            },
            {
              label: "Master Data",
              key: "/master",
              icon: <DatabaseOutlined />,
              children: [
                { label: "Device Management", key: "/master/devices" },
                { label: "User Management", key: "/master/users" },
                { label: "Area Management", key: "/master/area" },
                { label: "Unit Management", key: "/master/unit" },
                { label: "Sumdan Management", key: "/master/sumdan" },
                { label: "Jenis Management", key: "/master/jenis" },
                { label: "Produk Management", key: "/master/produk" },
              ],
            },
          ]}
          onClick={(e) => router.push(e.key)}
        />
        <div className="flex justify-center my-2">
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            loading={loading}
            onClick={() => setModalLogout(true)}
            size={window.innerWidth > 600 ? "middle" : "small"}
          >
            Logout
          </Button>
          <Modal
            open={modalLogout}
            title="Konfirmasi Logout"
            onCancel={() => setModalLogout(false)}
            onOk={() => handleLogout()}
          >
            <div>
              <p>Lanjutkan untuk logout?</p>
            </div>
          </Modal>
        </div>
        <div className="my-4 mx-1 sm:hidden">
          <Notification />
        </div>
      </Drawer>
    </div>
  );
};

const UserBio = ({ user }: { user: IUser }) => {
  return (
    <div className="bg-gradient-to-br from-purple-500 to-blue-400 p-2 rounded shadow text-gray-50">
      <div>
        <div className="flex gap-2 items-center font-bold text-xs opacity-70">
          <p>{user.role}</p>|<p>{user.position}</p>
        </div>
        <p className="font-bold">{user.fullname.toUpperCase()}</p>
      </div>
      <div className="flex flex-row gap-2 text-xs italic mt-2 opacity-70">
        <p>Lat: {user.lat}</p>|<p>Lng: {user.lng}</p>
      </div>
    </div>
  );
};
