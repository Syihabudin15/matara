import { Metadata } from "next";
import { AreaTable } from ".";

export const metadata: Metadata = {
  title: "Area Management",
};

export default function Page() {
  return (
    <div className="p-1">
      <AreaTable key={"Area Table"} />
    </div>
  );
}
