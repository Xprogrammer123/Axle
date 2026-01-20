"use client";

import { Button } from "@/components-beta/Button";
import Logo from "@/components-beta/Logo";
import { api } from "@/lib/api";
import { LockIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const canSubmit = useMemo(() => {
    if (!token) return false;
    if (!password || password.length < 8) return false;
    if (password !== confirm) return false;
    return true;
  }, [confirm, password, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
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
        Reset your password
      </h2>
      <p className="text-dark/50 text-sm font-medium mt-2 text-center max-w-sm">
        {done
          ? "Password updated. You can log in now."
          : "Enter a new password (min 8 characters)."}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 w-80 mt-6">
        <div className="flex group group-focus:ring-2 ring-accent/10 bg-dark/3 rounded-full border-2 border-dark/3 p-3 w-full items-center gap-1.5">
          <LockIcon className="text-accent text-lg" />
          <input
            type="password"
            className="text-dark outline-0 group bg-transparent w-full text-sm"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || done}
          />
        </div>
        <div className="flex group group-focus:ring-2 ring-accent/10 bg-dark/3 rounded-full border-2 border-dark/3 p-3 w-full items-center gap-1.5">
          <LockIcon className="text-accent text-lg" />
          <input
            type="password"
            className="text-dark outline-0 group bg-transparent w-full text-sm"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading || done}
          />
        </div>

        <Button
          className="mt-3 py-3 w-80"
          loading={loading}
          disabled={!canSubmit || loading || done}
        >
          Update password
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
            href="/app/auth/forgot-password"
          >
            Resend link
          </Link>
        </div>
      </form>
    </>
  );
}

const page = () => {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
};

export default page;
