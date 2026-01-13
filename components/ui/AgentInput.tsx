"use client";
import React, { useState, useEffect, useRef } from "react";
import { CaretDownIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { Textarea } from "./input";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
  description?: string;
}

interface AgentInputProps {
  onSend: (
    message: string,
    githubRepo?: { owner: string; repo: string }
  ) => void;
  disabled?: boolean;
}

export const AgentInput: React.FC<AgentInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [githubConnected, setGithubConnected] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoadingRepos(true);
        const data = await api.getGithubRepos();
        setRepos(data.repos || []);
        setGithubConnected(true);
      } catch (error) {
        // GitHub not connected or token expired - this is okay, repo selection is optional
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        if (
          errorMessage.includes("401") ||
          errorMessage.includes("GitHub") ||
          errorMessage.includes("not connected")
        ) {
          setGithubConnected(false);
        }
        // Silently fail - repo selection is optional
      } finally {
        setLoadingRepos(false);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsRepoDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!message.trim() || disabled) return;

    const repo = selectedRepo
      ? {
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
        }
      : undefined;

    onSend(message.trim(), repo);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white/1 border-2 border-white/2 rounded-3xl flex flex-col justify-between p-5 h-36 m-4">
      <textarea
        className="h-14 resize-none bg-transparent outline-0 ring-transparent border-0 text-white placeholder:text-white/50"
        placeholder="Ask anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      <div className="flex justify-between items-center">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              if (!githubConnected) return; // Don't open if GitHub not connected
              setIsRepoDropdownOpen(!isRepoDropdownOpen);
            }}
            className={`bg-black/20 border-3 items-center w-fit p-3 border-white/2.5 rounded-full flex gap-6 transition-colors ${
              githubConnected
                ? "hover:bg-black/30 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            title={
              !githubConnected ? "GitHub integration not connected" : undefined
            }
          >
            <div className="flex gap-2 items-center text-white/50">
              <GithubLogoIcon className="text-white/50 text-lg" />
              <p className="text-sm font-medium">
                {!githubConnected
                  ? "GitHub not connected"
                  : selectedRepo
                  ? selectedRepo.full_name
                  : "Select a repo (optional)"}
              </p>
            </div>
            {githubConnected && (
              <CaretDownIcon
                className={`text-lg text-white/50 transition-transform ${
                  isRepoDropdownOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {isRepoDropdownOpen && githubConnected && (
            <div className="absolute bottom-full backdrop-blur-xl mb-2 left-0 bg-black/40 border-2 border-white/10 rounded-2xl p-2 max-h-60 overflow-y-auto min-w-[300px] z-50">
              {loadingRepos ? (
                <p className="text-white/50 text-sm p-3">Loading repos...</p>
              ) : repos.length === 0 ? (
                <p className="text-white/50 text-sm p-3">
                  No repositories found
                </p>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSelectedRepo(null);
                      setIsRepoDropdownOpen(false);
                    }}
                    className="w-full text-left text-white/70 hover:text-white text-sm p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    None
                  </button>
                  {repos.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => {
                        setSelectedRepo(repo);
                        setIsRepoDropdownOpen(false);
                      }}
                      className={`w-full text-left text-sm p-2 rounded-lg transition-colors ${
                        selectedRepo?.id === repo.id
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <p className="font-medium">{repo.full_name}</p>
                      {repo.description && (
                        <p className="text-xs text-white/50 truncate">
                          {repo.description}
                        </p>
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="bg-linear-to-b hover:scale-105 transition-all duration-300 cursor-pointer from-[#36B460] to-[#049C20] rounded-xl p-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative"
        >
          {disabled ? (
            <div className="flex items-center justify-center">
              <div className="flex gap-0.5">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : (
            <ArrowUpRight className="text font-semibold text-white" />
          )}
        </button>
      </div>
    </div>
  );
};
