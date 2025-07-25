import { Metadata } from "next";
import { SumdanTable } from ".";

export const metadata: Metadata = {
  title: "Sumber Dana",
};

export default function Page() {
  return (
    <div className="p-1">
      <SumdanTable key={"Sumdan Table"} />
    </div>
  );
}
