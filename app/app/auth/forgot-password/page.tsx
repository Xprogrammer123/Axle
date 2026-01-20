"use client";

import { Button } from "@/components-beta/Button";
import Logo from "@/components-beta/Logo";
import { api } from "@/lib/api";
import { EnvelopeIcon } from "@phosphor-icons/react";
import Link from "next/link";
import React, { useState } from "react";

const page = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Logo size={36} />
      <h2 className="text-dark text-2xl font-semibold mt-8 text-center">
        Forgot your password?
      </h2>
      <p className="text-dark/50 text-sm font-medium mt-2 text-center max-w-sm">
        {sent
          ? "If an account exists for that email, we sent a reset link."
          : "Enter your email and we’ll send you a reset link."}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 w-80 mt-6">
        <div className="flex group group-focus:ring-2 ring-accent/10 bg-dark/3 rounded-full border-2 border-dark/3 p-3 w-full items-center gap-1.5">
          <EnvelopeIcon className="text-accent text-lg" />
          <input
            type="email"
            className="text-dark outline-0 group bg-transparent w-full text-sm"
            placeholder="Enter your email address here..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || sent}
          />
        </div>

        <Button
          className="mt-3 py-3 w-80"
          loading={loading}
          disabled={loading || sent}
        >
          Send reset link
        </Button>

        <div className="my-5 h-0.5 w-80 bg-dark/10 rounded-full"></div>

        <div className="flex items-center justify-between w-80 text-sm font-medium">
          <Link
            className="text-dark/40 hover:text-dark transition-all"
            href="/auth/login"
          >
            Back to Login
          </Link>
          <Link
            className="text-dark/40 hover:text-dark transition-all"
            href="/auth/signup"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </>
  );
};

export default page;
