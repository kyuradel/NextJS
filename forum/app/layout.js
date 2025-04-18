import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LoginBtn from "./LoginBtn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import LogOutBtn from "./LogOutBtn";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  let session = await getServerSession(authOptions)
  console.log(session)
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="navbar">
          <Link href="/" className="logo">Appleforum</Link>
          <Link href="/list">List</Link>
          <Link href="/write">Write</Link>
          <Link href="/register">Register</Link>
          {session ? 
          <span>{session.user.name} <LogOutBtn/> </span>
          : <LoginBtn/>}
        </div>
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
