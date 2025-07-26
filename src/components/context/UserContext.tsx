"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "../IInterface";

const userContext = createContext<IUser | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    if (!("geolocation" in navigator) || typeof window === "undefined") {
      alert("Geolocation tidak tersedia. Mohon aktifkan GPS!");
    }
    let temp: IUser | undefined = undefined;
    (async () => {
      await fetch("/api/auth")
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            const firstCoord = res.data.coord
              ? res.data.coord.split(",")
              : null;
            temp = {
              id: res.data.id,
              fullname: res.data.fullname,
              username: res.data.username,
              email: res.data.email,
              phone: res.data.phone,
              position: res.data.position,
              role: res.data.role,
              lat: firstCoord ? firstCoord[0] : 0,
              lng: firstCoord ? firstCoord[1] : 0,
              location: "",
            };
          }
        })
        .catch((err) => console.log(err));
    })();
    const successCallback = async (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      )
        .then((res) => res.json())
        .then(async (data) => {
          if (temp) {
            setUser({
              id: temp.id,
              fullname: temp.fullname,
              username: temp.username,
              email: temp.email,
              phone: temp.phone,
              position: temp.position,
              role: temp.role,
              lat: latitude,
              lng: longitude,
              location: `${data.display_name} | ${
                accuracy > 100 ? "FAKE" : "REAL"
              }`,
            });
            await fetch("/api/track", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: temp.id,
                coord: `${latitude},${longitude}`,
                location: `${data.display_name} | ${
                  accuracy > 100 ? "FAKE" : "REAL"
                }`,
              }),
            })
              .then((res) => res.json())
              .then(() => {
                console.log("Location Update:", data.display_name);
              })
              .catch((err) => console.error("Failed to send location:", err));
          }
        })
        .catch((err) => console.error(err));
    };

    const errorCallback = (err: GeolocationPositionError) => {
      alert(err.message);
    };
    const watcher = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return (
    <userContext.Provider value={user as IUser}>
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => useContext(userContext);
