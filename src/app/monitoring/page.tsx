import { Metadata } from "next";
import { MonitoringTable } from ".";

export const metadata: Metadata = { title: "Monitoring" };

export default function Page() {
  return (
    <div>
      <MonitoringTable />
    </div>
  );
}
