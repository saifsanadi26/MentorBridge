"use client";

import AuthProvider from "./AuthProvider";
import LiveStats from "./LiveStats";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
import Footer from "./Footer";

export default function AppShell({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <LiveStats />
    </AuthProvider>
  );
}
