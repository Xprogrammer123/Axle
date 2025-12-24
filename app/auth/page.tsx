"use client";
import { EnvelopeIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { motion } from "framer-motion";

const Authpage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      await authAPI.requestMagicLink(trimmedEmail);
      showToast("Magic link sent! Check your email.", "success");
      router.push("/auth/success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send magic link";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-dark min-h-screen p-4 w-screen overflow-hidden">
      <div className="mb-8 sm:mb-12">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="h-auto w-8 sm:w-10"
        />
      </div>
      <div className="w-full flex-1 flex gap-6 flex-col justify-center items-center">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white text-center">
          Enter your email to continue to axle.
        </h1>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="bg-white/2 gap-4 flex flex-col w-full sm:w-[85%] md:w-[70%] lg:w-[30%] h-auto p-6 sm:p-8 lg:p-10 rounded-4xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex w-full items-center gap-3 bg-white/2 p-4 sm:p-5 rounded-2xl focus-within:border-base transition-all duration-200">
            <EnvelopeIcon className="text-white/50 h-5 w-5 shrink-0" />
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter your email address here..."
              className="placeholder:text-white/50 w-full outline-0 text-white bg-transparent text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center gap-2 justify-center cursor-pointer bg-base hover:bg-base/90 active:scale-95 text-white font-semibold p-3 sm:p-3.5 rounded-full transition-all duration-200 mt-2  sm:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Continuing..." : "Continue"}
          </button>
        </form>
        <div className="text-white/60 text-xs sm:text-sm text-center px-4">
          By continuing, you agree to our{" "}
          <Link
            className="font-semibold text-white hover:text-base transition-colors"
            href="/tc"
          >
            terms of condition
          </Link>{" "}
          and{" "}
          <Link
            className="font-semibold text-white hover:text-base transition-colors"
            href="/privacy-policy"
          >
            privacy policy.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Authpage;
