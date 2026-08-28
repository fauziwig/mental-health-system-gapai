import { redirect } from "next/navigation";

export default function RootHomePage() {
  // Middleware handles checking admin_session cookie and redirecting to /admin or /admin/login
  redirect("/admin");
}
