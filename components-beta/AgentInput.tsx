"use client";
import React, { useState, useEffect, useRef } from "react";
import { CaretDownIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components-beta/Button";

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
    <div className="bg-white rounded-3xl flex flex-col justify-between p-4 md:p-5 h-32 md:h-36 m-3 md:m-4">
      <textarea
        className="h-12 md:h-14 resize-none bg-transparent outline-0 ring-transparent border-0 text-dark placeholder:text-dark/50 text-sm md:text-base"
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
            className={`bg-black/3 border-3 items-center w-fit p-2 md:p-3 border-dark/2.5 rounded-full flex gap-2 md:gap-6 transition-colors ${githubConnected
                ? "hover:bg-black/3 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
              }`}
            title={
              !githubConnected ? "GitHub integration not connected" : undefined
            }
          >
            <GithubLogoIcon className="text-dark/50 text-base md:text-lg flex-shrink-0" />
            <p className="text-xs md:text-sm font-medium truncate max-w-[120px] md:max-w-none">
              {!githubConnected
                ? "GitHub"
                : selectedRepo
                  ? selectedRepo.name
                  : "Repo"}
            </p>
            {githubConnected && (
              <CaretDownIcon
                className={`text-base md:text-lg text-dark/50 transition-transform flex-shrink-0 ${isRepoDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>
          {isRepoDropdownOpen && githubConnected && (
            <div className="absolute bottom-full backdrop-blur-xl w-64 md:w-72 mb-2 left-0 bg-white/3 border border-dark/5 shadow-lg shadow-dark/2 rounded-2xl p-2 max-h-48 overflow-y-auto z-50">
              {loadingRepos ? (
                <p className="text-dark/50 text-sm p-3">Loading repos...</p>
              ) : repos.length === 0 ? (
                <p className="text-dark/50 text-sm p-3">
                  No repositories found
                </p>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSelectedRepo(null);
                      setIsRepoDropdownOpen(false);
                    }}
                    className="w-full text-left text-dark/70 hover:text-dark text-sm p-2 rounded-lg hover:bg-dark/5 transition-colors"
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
                      className={`w-full text-left text-sm p-2 rounded-lg transition-colors ${selectedRepo?.id === repo.id
                          ? "bg-dark/10 text-dark"
                          : "text-dark/70 hover:text-dark hover:bg-dark/5"
                        }`}
                    >
                      <p className="font-medium truncate">{repo.full_name}</p>
                      {repo.description && (
                        <p className="text-xs text-dark/50 truncate">
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
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="p-2 md:p-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative flex-shrink-0"
        >
          {disabled ? (
            <div className="flex items-center justify-center">
              <div className="loader-light" />
            </div>
          ) : (
            <ArrowUpRight className="text-base md:text-lg font-semibold text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};
