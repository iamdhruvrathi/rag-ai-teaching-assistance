import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans antialiased">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
