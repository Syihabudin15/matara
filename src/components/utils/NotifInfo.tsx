"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { Badge } from "antd";

export const Notification = () => {
  const user = useUser();
  return (
    <div
      className={`${
        !user && "hidden"
      } flex gap-2 justify-center items-center flex-wrap`}
    >
      <NotifItem name="Verif" count={1} url="/pengajuan/verification" />
      <NotifItem name="Slik" count={0} url="/pengajuan/slik" />
      <NotifItem name="Approv" count={0} url="/pengajuan/approval" />
      <NotifItem name="SI" count={0} url="/pengajuan/si" />
      <NotifItem name="Cair" count={0} url="/pengajuan/cair" />
    </div>
  );
};

export const NotifItem = ({
  name,
  count,
  url,
}: {
  name: string;
  count: number;
  url: string;
}) => {
  const router = useRouter();

  return (
    // <div
    //   className="text-xs border rounded bg-gray-100 py-1 px-4 font-bold italic relative cursor-pointer"
    //   onClick={() => router.push(url)}
    // >
    //   <span>{name}</span>
    //   <span className="absolute -right-1 -top-1 rounded bg-red-500 px-1 text-gray-100">
    //     {count}
    //   </span>
    // </div>
    <div onClick={() => router.push(url)} className="cursor-pointer">
      <Badge count={count} overflowCount={10} showZero>
        <div className="text-xs border rounded bg-gray-100 py-1 px-4 font-bold italic">
          <span>{name}</span>
        </div>
      </Badge>
    </div>
  );
};
