"use client";
import { Button } from "@/components-beta/Button";
import Logo from "@/components-beta/Logo";
import { api } from "@/lib/api";
import { EnvelopeIcon, LockIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);
    try {
      await api.register(email.trim(), password);
      router.replace("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    try {
      await api.loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    }
  };

  return (
    <div className="flex bg-[#FAFAFA] text-dark h-screen w-screen flex-col items-center justify-center">
      <Logo size={36} />
      <h2 className="text-dark text-2xl font-semibold mt-8 text-center">
        Sign Up to continue to Axle
      </h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-1.5 w-80 mt-5">
        <div className="flex group group-focus:ring-2 ring-accent/10 bg-dark/3 rounded-full border-2 border-dark/3 p-3 w-full items-center gap-1.5">
          <EnvelopeIcon className="text-accent text-lg" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="text-dark outline-0 group bg-transparent w-full text-sm"
            placeholder="Enter your email address here..."
            required
          />
        </div>
        <div className="flex group group-focus:ring-2 ring-accent/10 bg-dark/3 rounded-full border-2 border-dark/3 p-3 w-full items-center gap-1.5">
          <LockIcon className="text-accent text-lg" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="text-dark outline-0 group bg-transparent w-full text-sm"
            placeholder="Enter your password here..."
            required
          />
        </div>
        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
        <Button type="submit" loading={loading} className="mt-3 py-3 w-80">
          Sign Up
        </Button>

        {/* <div className="my-5 h-px w-80 bg-dark/10 rounded-full"></div>

        <Button
          type="button"
          onClick={onGoogleLogin}
          className=" py-3 flex items-center gap-1.5 w-80 bg-dark text-white"
        >
          <Image
            src="/google.svg"
            alt=""
            width={80}
            height={80}
            className="size-5"
          />{" "}
          Continue with Google
        </Button> */}
      </form>
      <p className="text-dark/75 font-medium mt-5">Already have an account? <Link className="font-semibold text-accent" href="/auth/login">Login</Link></p>
    </div>
  );
};

export default Page;
