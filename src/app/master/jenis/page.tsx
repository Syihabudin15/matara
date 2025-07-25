import { Metadata } from "next";
import { JenisTable } from ".";

export const metadata: Metadata = {
  title: "Jenis Management",
};

export default function Page() {
  return (
    <div className="p-1">
      <JenisTable key={"Jenis Table"} />
    </div>
  );
}
