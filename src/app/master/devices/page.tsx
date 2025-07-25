import { Metadata } from "next";
import { DeviceTable } from ".";

export const metadata: Metadata = {
  title: "Devices Management",
};

export default function Page() {
  return (
    <div className="p-1">
      <DeviceTable key={"Device Table"} />
    </div>
  );
}
