import { Metadata } from "next";
import { ProdukTable } from ".";

export const metadata: Metadata = {
  title: "Produk Management",
};

export default function Page() {
  return (
    <div className="p-1">
      <ProdukTable key={"Produk Table"} />
    </div>
  );
}
