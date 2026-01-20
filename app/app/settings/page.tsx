"use client";

import { Button } from "@/components-beta/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const page = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data: any = await api.getProfile();
        const user = data?.user || data?.profile || data;
        setProfile(user);
        setName(user?.name || "");
        setEmail(user?.email || "");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const memberSince = useMemo(() => {
    const createdAt = profile?.createdAt;
    if (!createdAt) return "—";
    const d = new Date(createdAt);
    if (Number.isNaN(d.getTime())) return "—";
    return d
      .toLocaleDateString(undefined, { month: "long", year: "numeric" })
      .toUpperCase();
  }, [profile?.createdAt]);

  const profileImageSrc = useMemo(() => {
    return profile?.profileImageUrl || "/tayo.png";
  }, [profile?.profileImageUrl]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({ name });
      const data: any = await api.getProfile();
      const user = data?.user || data?.profile || data;
      setProfile(user);
      setName(user?.name || "");
      setEmail(user?.email || "");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-full overflow-y-auto gap-7 flex flex-col w-full p-10 max-w-4xl mx-auto">
      {/* <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-dark font-semibold">Profile Picture</h3>
          <p className="text-dark/40 text-sm font-medium">
            Upload a new profile picture
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Image
            src={profileImageSrc}
            alt="profile"
            width={300}
            height={300}
            className="size-15 cursor-pointer rounded-full object-cover"
          />
          <p className="text-xs text-dark/40 font-medium">
            JPG, PNG, GIF, or WebP. Max 5MB.
          </p>
        </div>
      </div> */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-dark font-semibold">Personal Information</h3>
          <p className="text-dark/40 text-sm font-medium">
            Update your personal information
          </p>
        </div>
        <form className="flex gap-3 flex-col" onSubmit={handleProfileSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="" className="text-dark/40 font-semibold">
              Name
            </label>
            <input
              type="text"
              className="bg-dark/3 outline-0 rounded-xl text-sm p-2.5 text-dark w-72"
              placeholder="Your Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="" className="text-dark/40 font-semibold">
              Email
            </label>
            <input
              type="email"
              className="bg-dark/3 outline-0 rounded-xl text-sm p-2.5 text-dark w-72"
              placeholder="Your Name..."
              value={email}
              disabled
            />
          </div>
          <Button
            className="w-fit p-3 px-7 mt-3 bg-dark"
            loading={saving}
            disabled={loading || saving}
          >
            Save Changes
          </Button>
        </form>
      </div>
      <div className="w-full h-0.5 bg-dark rounded-full"></div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-dark font-semibold">Change Password</h3>
            <p className="text-dark/40 text-sm font-medium">
              Update your password to keep your account secure
            </p>
          </div>
          <Link
            href="/app/auth/forgot-password"
            className="text-dark/35 hover:text-dark transition-all duration-300 text-sm font-medium"
          >
            Forgot Password?
          </Link>
        </div>
        <form className="flex gap-3 flex-col" onSubmit={handlePasswordSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="" className="text-dark/40 font-semibold">
              Name
            </label>
            <input
              type="password"
              className="bg-dark/3 outline-0 rounded-xl text-sm p-2.5 text-dark w-72"
              placeholder="Your Name..."
              defaultValue="Ariyo2026"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="" className="text-dark/40 font-semibold">
              Email
            </label>
            <input
              type="password"
              className="bg-dark/3 outline-0 rounded-xl text-sm p-2.5 text-dark w-72"
              placeholder="Your Name..."
              defaultValue="Ariyo2026"
            />
          </div>
          <Button className="w-fit p-3 px-7 mt-3 bg-dark">
            Update Password
          </Button>
        </form>
      </div>

      <div className="w-full h-0.5 bg-dark rounded-full"></div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-dark font-semibold">Account Details</h3>
          <p className="text-dark/40 text-sm font-medium">
            Your account information
          </p>
        </div>
        <div className="flex gap-3 w-72 items-center">
          <div className="bg-dark/3 flex flex-col gap-1 w-full p-3.5 rounded-2xl">
            <p className="text-dark/40 text-sm font-semibold">MEMBER SINCE</p>
            <p className="text-dark text-sm font-bold">{memberSince}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-3xl p-5 mt-6 bg-red-500/3 border border-red-500">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-dark font-semibold">Danger Zone</h3>
          <p className="text-dark/40 text-sm font-medium">
            Deleting your account will purge all agents, integration tokens, and
            execution history. This is irreversible.
          </p>
        </div>
        <Button className="bg-red-500 text-white p-3">Delete Account</Button>
      </div>
    </div>
  );
};

export default page;
