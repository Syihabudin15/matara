"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "../IInterface";

const userContext = createContext<IUser | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>();

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
            return;
          }
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator) || typeof window === "undefined") {
      alert("Geolocation is not available");
      return;
    }
    let locStatus = "REAL";

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      if (user) {
        setUser({ ...user, lat: latitude, lng: longitude });
        locStatus = accuracy > 100 ? "FAKE" : "REAL";
      }
    };

    const errorCallback = (err: GeolocationPositionError) => {
      alert(err.message);
    };

    const watcher = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback
    );
    // Interval to call API every 10 seconds
    const intervalId = setInterval(() => {
      if (user && user.lat && user.lng) {
        // Ganti URL dan payload sesuai kebutuhanmu
        (async () => {
          let location = "";
          await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${user.lat}&lon=${user.lng}`
          )
            .then((res) => res.json())
            .then((data) => {
              location = data.display_name;
            })
            .catch((err) => console.error(err));

          await fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
              coord: `${user.lat},${user.lng}`,
              location: `${location} | ${locStatus}`,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Location sent to API:", data.data);
            })
            .catch((err) => console.error("Failed to send location:", err));
        })();
      }
    }, 5000); // 5 detik

    // optional: stop tracking on unmount
    return () => {
      navigator.geolocation.clearWatch(watcher);
      clearInterval(intervalId);
    };
  }, [user]);
  return (
    <userContext.Provider value={user as IUser}>
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => useContext(userContext);
