import { Metadata } from "next";
import { SimulasiTable } from ".";

export const metadata: Metadata = {
  title: "Simulasi Kredit",
};
export default function Page() {
  return (
    <div>
      <SimulasiTable />
    </div>
  );
}
