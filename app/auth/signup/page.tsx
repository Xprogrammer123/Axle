"use client";
import { Button } from "@/components-beta/Button";
import Logo from "@/components-beta/Logo";
import { api } from "@/lib/api";
import { EnvelopeIcon, LockIcon } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/animations";


const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);
    try {
      await api.register(email.trim(), password);
      // Redirect to onboarding instead of app
      router.replace("/auth/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <div className="bg hidden md:flex w-1/2">
        <div className="animated-bg-container">
          {/* Large floating gradient orbs */}
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>

          {/* Animated rings */}
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>

          {/* Floating particles */}
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
          <div className="particle particle-7"></div>
          <div className="particle particle-8"></div>

          {/* Light beams */}
          <div className="light-beam beam-1"></div>
          <div className="light-beam beam-2"></div>

          {/* Mesh gradient overlay */}
          <div className="mesh-gradient"></div>

          <style jsx>{`
            .animated-bg-container {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden;
              background: linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%);
            }

            /* Large Gradient Orbs - Green Theme */
            .orb {
              position: absolute;
              border-radius: 50%;
              filter: blur(100px);
              opacity: 0.7;
              animation: float-large 15s ease-in-out infinite;
              will-change: transform;
            }

            .orb-1 {
              width: 600px;
              height: 600px;
              background: radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.4) 40%, transparent 70%);
              top: -15%;
              left: -15%;
              animation-duration: 18s;
              animation-delay: 0s;
            }

            .orb-2 {
              width: 550px;
              height: 550px;
              background: radial-gradient(circle, rgba(52, 211, 153, 0.7) 0%, rgba(16, 185, 129, 0.4) 40%, transparent 70%);
              bottom: -10%;
              right: -10%;
              animation-duration: 22s;
              animation-delay: -8s;
            }

            .orb-3 {
              width: 500px;
              height: 500px;
              background: radial-gradient(circle, rgba(20, 184, 166, 0.6) 0%, rgba(13, 148, 136, 0.3) 40%, transparent 70%);
              top: 30%;
              left: 35%;
              animation-duration: 20s;
              animation-delay: -15s;
            }

            .orb-4 {
              width: 450px;
              height: 450px;
              background: radial-gradient(circle, rgba(132, 204, 22, 0.5) 0%, rgba(16, 185, 129, 0.3) 40%, transparent 70%);
              bottom: 20%;
              left: 10%;
              animation-duration: 25s;
              animation-delay: -5s;
            }

            @keyframes float-large {
              0%, 100% {
                transform: translate(0, 0) scale(1) rotate(0deg);
              }
              20% {
                transform: translate(80px, -60px) scale(1.15) rotate(45deg);
              }
              40% {
                transform: translate(120px, 40px) scale(0.95) rotate(90deg);
              }
              60% {
                transform: translate(-60px, 80px) scale(1.1) rotate(135deg);
              }
              80% {
                transform: translate(-80px, -40px) scale(1.05) rotate(180deg);
              }
            }

            /* Animated Rings - Green Theme */
            .ring {
              position: absolute;
              border-radius: 50%;
              border: 2px solid rgba(16, 185, 129, 0.2);
              animation: ring-expand 8s ease-in-out infinite;
              will-change: transform, opacity;
            }

            .ring-1 {
              width: 300px;
              height: 300px;
              top: 20%;
              left: 60%;
              animation-delay: 0s;
            }

            .ring-2 {
              width: 400px;
              height: 400px;
              bottom: 30%;
              left: 20%;
              animation-delay: -3s;
              border-color: rgba(52, 211, 153, 0.2);
            }

            .ring-3 {
              width: 350px;
              height: 350px;
              top: 50%;
              right: 15%;
              animation-delay: -6s;
              border-color: rgba(20, 184, 166, 0.2);
            }

            @keyframes ring-expand {
              0%, 100% {
                transform: scale(1) rotate(0deg);
                opacity: 0.3;
              }
              50% {
                transform: scale(1.8) rotate(180deg);
                opacity: 0;
              }
            }

            /* Floating Particles */
            .particle {
              position: absolute;
              background: rgba(255, 255, 255, 0.6);
              border-radius: 50%;
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
              animation: rise 12s linear infinite;
              will-change: transform, opacity;
            }

            .particle-1 {
              width: 6px;
              height: 6px;
              left: 15%;
              bottom: -10%;
              animation-delay: 0s;
            }

            .particle-2 {
              width: 8px;
              height: 8px;
              left: 45%;
              bottom: -10%;
              animation-delay: -2s;
              animation-duration: 14s;
            }

            .particle-3 {
              width: 5px;
              height: 5px;
              left: 70%;
              bottom: -10%;
              animation-delay: -4s;
              animation-duration: 16s;
            }

            .particle-4 {
              width: 7px;
              height: 7px;
              left: 30%;
              bottom: -10%;
              animation-delay: -6s;
              animation-duration: 13s;
            }

            .particle-5 {
              width: 6px;
              height: 6px;
              left: 60%;
              bottom: -10%;
              animation-delay: -8s;
              animation-duration: 15s;
            }

            .particle-6 {
              width: 5px;
              height: 5px;
              left: 85%;
              bottom: -10%;
              animation-delay: -10s;
              animation-duration: 17s;
            }

            .particle-7 {
              width: 7px;
              height: 7px;
              left: 25%;
              bottom: -10%;
              animation-delay: -3s;
              animation-duration: 18s;
            }

            .particle-8 {
              width: 6px;
              height: 6px;
              left: 55%;
              bottom: -10%;
              animation-delay: -9s;
              animation-duration: 14s;
            }

            @keyframes rise {
              0% {
                transform: translateY(0) translateX(0) scale(0) rotate(0deg);
                opacity: 0;
              }
              5% {
                opacity: 1;
              }
              95% {
                opacity: 0.8;
              }
              100% {
                transform: translateY(-110vh) translateX(100px) scale(1.5) rotate(720deg);
                opacity: 0;
              }
            }

            /* Light Beams */
            .light-beam {
              position: absolute;
              width: 2px;
              height: 100%;
              background: linear-gradient(
                to bottom,
                transparent 0%,
                rgba(16, 185, 129, 0.4) 50%,
                transparent 100%
              );
              animation: beam-move 6s ease-in-out infinite;
              will-change: transform, opacity;
            }

            .beam-1 {
              left: 30%;
              animation-delay: 0s;
            }

            .beam-2 {
              right: 35%;
              animation-delay: -3s;
              background: linear-gradient(
                to bottom,
                transparent 0%,
                rgba(52, 211, 153, 0.4) 50%,
                transparent 100%
              );
            }

            @keyframes beam-move {
              0%, 100% {
                transform: translateX(0) scaleY(0.5);
                opacity: 0.3;
              }
              50% {
                transform: translateX(100px) scaleY(1);
                opacity: 0.8;
              }
            }

            /* Mesh Gradient Overlay - Enhanced Green */
            .mesh-gradient {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: 
                radial-gradient(at 30% 20%, rgba(16, 185, 129, 0.35) 0px, transparent 50%),
                radial-gradient(at 75% 10%, rgba(52, 211, 153, 0.25) 0px, transparent 50%),
                radial-gradient(at 10% 50%, rgba(20, 184, 166, 0.25) 0px, transparent 50%),
                radial-gradient(at 85% 45%, rgba(16, 185, 129, 0.3) 0px, transparent 50%),
                radial-gradient(at 15% 85%, rgba(5, 150, 105, 0.35) 0px, transparent 50%),
                radial-gradient(at 70% 80%, rgba(20, 184, 166, 0.25) 0px, transparent 50%);
              animation: meshMove 25s ease-in-out infinite;
              opacity: 0.6;
              will-change: transform;
            }

            @keyframes meshMove {
              0%, 100% {
                transform: scale(1) rotate(0deg);
              }
              33% {
                transform: scale(1.15) rotate(5deg);
              }
              66% {
                transform: scale(0.95) rotate(-5deg);
              }
            }

            /* Premium shimmer effect */
            .animated-bg-container::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: linear-gradient(
                45deg,
                transparent 25%,
                rgba(255, 255, 255, 0.15) 45%,
                rgba(255, 255, 255, 0.2) 50%,
                rgba(255, 255, 255, 0.15) 55%,
                transparent 75%
              );
              animation: shimmer 6s linear infinite;
              will-change: transform;
            }

            @keyframes shimmer {
              0% {
                transform: translateX(-100%) translateY(-100%) rotate(45deg);
              }
              100% {
                transform: translateX(100%) translateY(100%) rotate(45deg);
              }
            }

            /* Grain texture */
            .animated-bg-container::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
              opacity: 0.03;
              pointer-events: none;
              mix-blend-mode: overlay;
            }
          `}</style>
        </div>
      </div>
      <div className="flex bg-background items-center justify-center md:w-1/2 w-full dark:bg-[#0f0f0f] text-dark dark:text-white h-screen flex-col">
        <StaggerContainer className="flex flex-col items-center">
          <StaggerItem>
            <Logo size={36} />
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-dark dark:text-white text-2xl font-semibold mt-8 text-center">
              Sign Up to continue to Axle
            </h2>
          </StaggerItem>

          <form onSubmit={onSubmit} className="flex flex-col gap-2.5 w-80 mt-5">
            <StaggerItem>
              <div className="flex group hover:scale-[1.02] transition-all duration-300 focus-within:ring-2 ring-accent/20 bg-dark/3 dark:bg-white/2 dark:border-white/3 dark:border-1 rounded-full border-2 border-dark/3 p-3 w-full items-center gap-1.5">
                <EnvelopeIcon className="text-accent text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="text-dark dark:text-white outline-0 group bg-transparent w-full text-sm"
                  placeholder="Enter your email address here..."
                  required
                />
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex group hover:scale-[1.02] transition-all duration-300 focus-within:ring-2 ring-accent/20 bg-dark/3 dark:bg-white/2 dark:border-white/3 dark:border-1 rounded-full border-2 border-dark/3 p-3 w-full items-center gap-1.5">
                <LockIcon className="text-accent text-lg" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="text-dark dark:text-white outline-0 group bg-transparent w-full text-sm"
                  placeholder="Enter your password here..."
                  required
                />
              </div>
            </StaggerItem>

            {error && (
              <StaggerItem>
                <div className="text-sm dark:text-white text-red-600 mt-2">{error}</div>
              </StaggerItem>
            )}

            <StaggerItem>
              <Button type="submit" loading={loading} className="mt-3 py-3 w-80 hover:scale-[1.02] transition-all duration-300">
                Sign Up
              </Button>
            </StaggerItem>

            <StaggerItem>
              <div className="flex items-center gap-3 w-full mt-4">
                <div className="h-[1px] bg-dark/10 dark:bg-white/10 flex-1" />
                <span className="text-xs font-medium text-dark/40 dark:text-white/40">OR</span>
                <div className="h-[1px] bg-dark/10 dark:bg-white/10 flex-1" />
              </div>
            </StaggerItem>

            <StaggerItem>
              <Button
                type="button"
                onClick={async () => {
                  try {
                    setGoogleLoading(true);
                    await api.loginWithGoogle();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Google login failed");
                  } finally {
                    setGoogleLoading(false);
                  }
                }}
                className="w-full bg-white dark:bg-white/5 border border-dark/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 rounded-full py-3 flex items-center justify-center gap-3 group"
                loading={googleLoading}
              >
                <Image
                  src="/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-sm font-medium text-dark/70 dark:text-white/80 group-hover:text-dark dark:group-hover:text-white">
                  Continue with Google
                </span>
              </Button>
            </StaggerItem>
          </form>

          <StaggerItem>
            <p className="text-dark/75 text-sm dark:text-white font-medium mt-5">
              Already have an account? <Link className="font-semibold text-accent hover:underline transition-all" href="/auth/login">Login</Link>
            </p>
          </StaggerItem>
        </StaggerContainer>


      </div>
    </div>
  );
};

export default Page;
