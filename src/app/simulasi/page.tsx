import { Metadata } from "next";
import { SimulasiTable } from ".";

export const metadata: Metadata = {
  title: "Simulasi",
};
export default function Page() {
  return (
    <div>
      <SimulasiTable />
    </div>
  );
}
