"use client";
import { EnvelopeIcon, UserIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AuthRequestType } from "@/types/AuthRequest";
import apiRequest from "@/lib/api";
import { useRouter } from "next/navigation";

const Authpage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authRequestBody: AuthRequestType = {
      name: name,
      email: email,
    };

    try {
      if (!email || !email.includes("@")) throw new Error("Invalid email.");
      if (!name || name.trim().length < 2) throw new Error("Invalid name.");

      const res = await apiRequest(`/auth/request-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authRequestBody),
      });

      // handle response
      let data;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        data = { err };
      }

      if (!res.ok)
        throw new Error(data?.message || `Request failed (${res.status})`);

      router.push("/success");
    } catch (err: any) {
      console.error("Request link error:", err.message || err);

      router.push("/error");
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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center max-w-xs sm:max-w-sm lg:max-w-md">
          Enter your email to <br /> continue to axle.
        </h1>
        <form
          onClick={(e) => {
            handleSubmit(e);
          }}
          className="bg-white/2 gap-4 flex flex-col w-full sm:w-[85%] md:w-[70%] lg:w-[30%] h-auto p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex w-full items-center gap-3 bg-white/2 py-4 sm:py-5 px-4 rounded-xl focus-within:border-base transition-all duration-200">
            <UserIcon className="text-white/50 h-5 w-5 shrink-0" />
            <input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Enter your name here..."
              className="placeholder:text-white/50 w-full outline-0 text-white bg-transparent text-sm sm:text-base"
            />
          </div>
          <div className="flex w-full items-center gap-3 bg-white/2 p-4 sm:p-5 rounded-xl focus-within:border-base transition-all duration-200">
            <EnvelopeIcon className="text-white/50 h-5 w-5 shrink-0" />
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter your email address here..."
              className="placeholder:text-white/50 w-full outline-0 text-white bg-transparent text-sm sm:text-base"
            />
          </div>
          <button className="flex w-full items-center gap-2 justify-center cursor-pointer bg-base hover:bg-base/90 active:scale-95 text-white font-semibold p-4 sm:p-5 rounded-full transition-all duration-200 mt-2 text-sm sm:text-white disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Continuing..." : "Continue"}
          </button>
        </form>
        <div className="text-white/60 text-xs sm:text-sm text-center max-w-xs sm:max-w-sm px-4">
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
