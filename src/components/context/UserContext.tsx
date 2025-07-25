"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IUser } from "../IInterface";

const userContext = createContext<IUser | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await fetch("/api/auth")
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            setUser({
              id: res.data.id,
              fullname: res.data.fullname,
              username: res.data.username,
              email: res.data.email,
              phone: res.data.phone,
              position: res.data.position,
              role: res.data.role,
              lat: 0,
              lng: 0,
            });
          } else {
            router.push("/");
          }
        })
        .catch((err) => console.log(err));
    })();
  }, []);
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not available");
      return;
    }

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      if (user) {
        setUser({ ...user, lat: latitude, lng: longitude });
      }
    };

    const errorCallback = (err: GeolocationPositionError) => {
      alert(err.message);
    };

    const watcher = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback
    );

    // optional: stop tracking on unmount
    return () => navigator.geolocation.clearWatch(watcher);
  }, [user]);
  return (
    <userContext.Provider value={user as IUser}>
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => useContext(userContext);
