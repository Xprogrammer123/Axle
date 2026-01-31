"use client";

import { Button } from "@/components-beta/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Modal } from "@/components/ui/modal";

const page = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await api.deleteAccount();
      window.location.href = "/auth/login";
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to delete account");
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Max 5MB.");
      return;
    }

    setUploading(true);
    try {
      // 1. Get signature
      const { signature, timestamp, cloudName, apiKey } = await api.getUploadSignature();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "avatars");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const secureUrl = data.secure_url;

      // 3. Update profile
      await api.updateProfile({ profileImageUrl: secureUrl });

      // 4. Update local state
      const profileData: any = await api.getProfile();
      const user = profileData?.user || profileData?.profile || profileData;
      setProfile(user);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="h-full pt-20 overflow-y-auto gap-7 flex flex-col w-full p-10 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-dark dark:text-white font-semibold">Profile Picture</h3>
          <p className="text-dark/40 dark:text-white/40 text-sm font-medium">
            Upload a new profile picture. Click image to change.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative group">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/gif, image/webp"
              onChange={handleFileChange}
            />
            <div
              className="relative size-20 cursor-pointer rounded-full overflow-hidden border-2 border-dark/10 dark:border-white/10"
              onClick={handleImageClick}
            >
              <Image
                src={profileImageSrc}
                alt="profile"
                fill
                className={`object-cover transition-all duration-300 group-hover:opacity-75 ${uploading ? "opacity-50" : ""}`}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              className="w-fit text-xs px-3 py-1.5 h-auto bg-dark/10 text-dark hover:bg-dark/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              onClick={handleImageClick}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Change Picture"}
            </Button>
            <p className="text-xs text-dark/40 dark:text-white/40 font-medium">
              JPG, PNG, GIF, or WebP. Max 5MB.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-dark dark:text-white font-semibold">Personal Information</h3>
          <p className="text-dark/40 dark:text-white/40 text-sm font-medium">
            Update your personal information
          </p>
        </div>
        <form className="flex gap-3 flex-col" onSubmit={handleProfileSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="" className="text-dark/40 dark:text-white/40 font-semibold">
              Name
            </label>
            <input
              type="text"
              className="bg-dark/3 dark:bg-white/2 border border-white/3 dark:text-white outline-0 rounded-xl text-sm p-2.5 text-dark w-72"
              placeholder="Your Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="" className="text-dark/40 dark:text-white/40 font-semibold">
              Email
            </label>
            <input
              type="email"
              className="bg-dark/3 dark:bg-white/2 border border-white/3 dark:text-white outline-0 rounded-xl text-sm p-2.5 text-dark w-72"
              placeholder="Your Email..."
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
            <h3 className="text-dark dark:text-white font-semibold">Change Password</h3>
            <p className="text-dark/40 dark:text-white/40 text-sm font-medium">
              Update your password to keep your account secure
            </p>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-dark/35 hover:text-dark transition-all duration-300 text-sm font-medium"
          >
            Forgot Password?
          </Link>
        </div>
        <form className="flex gap-3 flex-col" onSubmit={handlePasswordSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="" className="text-dark/40 dark:text-white/40 font-semibold">
              Current Password
            </label>
            <input
              type="password"
              className="bg-dark/3 dark:bg-white/2 dark:text-white outline-0 rounded-xl text-sm p-2.5 text-dark w-72"
              placeholder="Current Password..."
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="" className="text-dark/40 dark:text-white/40 font-semibold">
              New Password
            </label>
            <input
              type="password"
              className="bg-dark/3 dark:bg-white/2 dark:text-white outline-0 rounded-xl text-sm p-2.5 text-dark w-72"
              placeholder="New Password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="" className="text-dark/40 dark:text-white/40 font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              className="bg-dark/3 dark:bg-white/2 dark:text-white outline-0 rounded-xl text-sm p-2.5 text-dark w-72"
              placeholder="Confirm New Password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            className="w-fit p-3 px-7 mt-3 bg-dark"
            loading={passwordLoading}
            disabled={passwordLoading}
          >
            Update Password
          </Button>
        </form>
      </div>

      <div className="w-72 h-0.5 bg-dark dark:bg-white/5 rounded-full"></div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-dark dark:text-white font-semibold">Account Details</h3>
          <p className="text-dark/40 dark:text-white/40 text-sm font-medium">
            Your account information
          </p>
        </div>
        <div className="flex gap-3 w-72 items-center">
          <div className="bg-dark/3 dark:bg-white/3 flex flex-col gap-1 w-full p-3.5 rounded-2xl">
            <p className="text-dark/40 dark:text-white/40 text-sm font-semibold">MEMBER SINCE</p>
            <p className="text-dark dark:text-white text-sm font-bold">{memberSince}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-3xl p-5 mt-6 bg-red-500/3 border border-red-500">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-dark dark:text-white font-semibold">Danger Zone</h3>
          <p className="text-dark/40 dark:text-white/40 text-sm font-medium">
            Deleting your account will purge all agents, integration tokens, and
            execution history. This is irreversible.
          </p>
        </div>
        <Button
          className="bg-red-500 dark:bg-red-600 text-white p-3 hover:bg-red-600 dark:hover:bg-red-700 transition-all"
          onClick={handleDeleteClick}
        >
          Delete Account
        </Button>
      </div>

      <Modal className="bg-[#fafafa] rounded-4xl backdropblur-lg dark:bg-[#0C0C0C]" open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="md">
        <Modal.Header onClose={() => setDeleteModalOpen(false)}>
          Delete Account
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-3">
            <p className="text-dark dark:text-white">
              Are you sure you want to delete your account? This action is
              <span className="font-bold text-red-500"> irreversible</span> and will delete all your data, including all created agents and execution history.
            </p>
            {/* <p className="text-sm text-dark/60 dark:text-white/60">
              Please type <span className="font-mono bg-dark/5 dark:bg-white/10 px-1 rounded select-all">delete my account</span> to confirm.
            </p> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bg-dark/5 py-2.5 dark:bg-white/10 text-dark dark:text-white hover:bg-dark/10 dark:hover:bg-white/20"
            onClick={() => setDeleteModalOpen(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 py-2.5 text-white hover:bg-red-600"
            loading={deleteLoading}
            onClick={confirmDeleteAccount}
          >
            Delete Everything
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default page;
