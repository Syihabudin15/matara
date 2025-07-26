import { Metadata } from "next";
import UserTable from ".";

export const metadata: Metadata = {
  title: "User Management",
};

export default function Page() {
  return (
    <div className="p-1">
      <UserTable key={"userTable"} />
    </div>
  );
}
