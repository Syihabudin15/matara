"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { INotif } from "../IInterface";

const notifContext = createContext<INotif>({
  simulation: 0,
  verif: 0,
  slik: 0,
  approv: 0,
  akad: 0,
  si: 0,
});

export const NotifProvider = ({ children }: { children: React.ReactNode }) => {
  const [notif, setNotif] = useState<INotif>();

  useEffect(() => {
    (async () => {
      await fetch("/api/notification")
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            setNotif({
              simulation: 0,
              verif: 0,
              slik: 0,
              approv: 0,
              akad: 0,
              si: 0,
            });
          }
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  return (
    <notifContext.Provider value={notif as INotif}>
      {children}
    </notifContext.Provider>
  );
};

export const useNotif = () => useContext(notifContext);
