import { Metadata } from "next";
import { CreateSimulation } from ".";

export const metadata: Metadata = {
  title: "Simulasi Kredit",
};
export default function Page() {
  return (
    <div className="p-1">
      <CreateSimulation mode="Simulasi" />
    </div>
  );
}
