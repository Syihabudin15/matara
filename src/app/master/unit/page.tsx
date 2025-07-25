import { Metadata } from "next";
import { UnitTable } from ".";

export const metadata: Metadata = {
  title: "Unit Management",
};

export default function Page() {
  return (
    <div className="p-1">
      <UnitTable key={"Unit Table"} />
    </div>
  );
}
