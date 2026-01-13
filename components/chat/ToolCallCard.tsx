"use client";
import React from "react";
import Image from "next/image";

interface ToolCallCardProps {
  toolName: string;
  status: "running" | "success" | "failed";
  params?: Record<string, any>;
  result?: any;
  duration?: number;
}

const getToolIcon = (toolName: string): string => {
  const toolLower = toolName.toLowerCase();
  if (toolLower.includes("github")) return "/github.svg";
  if (
    toolLower.includes("twitter") ||
    toolLower.includes("x") ||
    toolLower.includes("post")
  )
    return "/twitter.svg";
  if (toolLower.includes("slack")) return "/slack.svg";
  if (toolLower.includes("google")) return "/google.svg";
  if (toolLower.includes("notion")) return "/notion.svg";
  if (toolLower.includes("docs") || toolLower.includes("doc"))
    return "/docs.svg";
  return "/logo.svg";
};

const getActionDescription = (
  toolName: string,
  params?: Record<string, any>,
  result?: any
): string => {
  const toolLower = toolName.toLowerCase();

  // Twitter/X actions
  if (toolLower.includes("post") || toolLower.includes("tweet")) {
    if (params?.text) {
      const preview = params.text.substring(0, 40);
      return `Posted: "${preview}${params.text.length > 40 ? "..." : ""}"`;
    }
    return "Posted tweet";
  }

  // GitHub actions
  if (
    toolLower.includes("create_issue") ||
    (toolLower.includes("github") && toolLower.includes("issue"))
  ) {
    if (params?.title) {
      return `Created issue: ${params.title}`;
    }
    if (result?.title) {
      return `Created issue: ${result.title}`;
    }
    return "Created GitHub issue";
  }

  if (
    toolLower.includes("create_repo") ||
    (toolLower.includes("github") && toolLower.includes("repo"))
  ) {
    if (params?.name || result?.name) {
      return `Created repo: ${params?.name || result?.name}`;
    }
    return "Created GitHub repository";
  }

  if (toolLower.includes("create_file") || toolLower.includes("update_file")) {
    if (params?.path) {
      return `${toolLower.includes("update") ? "Updated" : "Created"}: ${
        params.path
      }`;
    }
    return `${toolLower.includes("update") ? "Updated" : "Created"} file`;
  }

  // Google Docs
  if (toolLower.includes("docs") && toolLower.includes("create")) {
    if (result?.title) {
      return `Created doc: ${result.title}`;
    }
    return "Created Google Doc";
  }

  if (toolLower.includes("docs") && toolLower.includes("append")) {
    return "Added content to document";
  }

  // Calendar
  if (toolLower.includes("calendar") && toolLower.includes("create")) {
    if (params?.summary || result?.summary) {
      return `Created event: ${params?.summary || result?.summary}`;
    }
    return "Created calendar event";
  }

  // Gmail
  if (toolLower.includes("gmail") && toolLower.includes("send")) {
    if (params?.to) {
      return `Sent email to ${params.to}`;
    }
    return "Sent email";
  }

  // Generic fallback - use tool name with better formatting
  return toolName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/github|twitter|gmail|google|calendar/gi, (m) => m.toLowerCase());
};

const getActionLink = (
  toolName: string,
  result: any,
  params?: Record<string, any>
): string | null => {
  const toolLower = toolName.toLowerCase();

  // Twitter/X post links
  if (
    (toolLower.includes("twitter") ||
      toolLower.includes("x") ||
      toolLower.includes("post")) &&
    result
  ) {
    if (result?.id) {
      return `https://twitter.com/i/web/status/${result.id}`;
    }
    if (result?.tweetId) {
      return `https://twitter.com/i/web/status/${result.tweetId}`;
    }
    if (result?.url) {
      return result.url;
    }
    if (result?.data?.id) {
      return `https://twitter.com/i/web/status/${result.data.id}`;
    }
  }

  // GitHub links
  if (toolLower.includes("github")) {
    if (result?.html_url) return result.html_url;
    if (result?.url) return result.url;
    if (result?.data?.html_url) return result.data.html_url;
    if (params?.owner && params?.repo) {
      if (result?.number || result?.data?.number) {
        return `https://github.com/${params.owner}/${params.repo}/issues/${
          result?.number || result?.data?.number
        }`;
      }
      if (result?.name || result?.data?.name) {
        return `https://github.com/${params.owner}/${
          result?.name || result?.data?.name
        }`;
      }
      return `https://github.com/${params.owner}/${params.repo}`;
    }
  }

  // Google Docs/Sheets
  if (toolLower.includes("docs") || toolLower.includes("sheet")) {
    if (result?.webViewLink) return result.webViewLink;
    if (result?.alternateLink) return result.alternateLink;
    if (result?.data?.webViewLink) return result.data.webViewLink;
    if (result?.data?.alternateLink) return result.data.alternateLink;
  }

  // Calendar events
  if (toolLower.includes("calendar")) {
    if (result?.htmlLink) return result.htmlLink;
    if (result?.data?.htmlLink) return result.data.htmlLink;
  }

  return null;
};

export const ToolCallCard: React.FC<ToolCallCardProps> = ({
  toolName,
  status,
  params,
  result,
  duration,
}) => {
  const icon = getToolIcon(toolName);
  const isRunning = status === "running";
  const actionLink =
    status === "success" ? getActionLink(toolName, result, params) : null;
  const actionDescription = getActionDescription(toolName, params, result);

  const cardContent = (
    <div
      className={`flex w-fit bg-black/20 border-4 border-white/3 rounded-3xl p-3.5 pr-5 items-center gap-3 transition-all duration-150 ${
        isRunning
          ? "animate-pulse border-[#36B460]/40 shadow-lg shadow-[#36B460]/30 scale-[1.02]"
          : actionLink
          ? "hover:scale-105 cursor-pointer hover:bg-black/30 hover:border-white/10 hover:shadow-lg transition-transform"
          : "hover:scale-[1.02] transition-transform"
      }`}
    >
      <div className="relative">
        <Image
          src={icon}
          alt={toolName}
          width={48}
          height={48}
          className={`rounded-lg transition-transform ${
            isRunning ? "animate-pulse" : ""
          }`}
        />
        {isRunning && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#36B460] rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#36B460] rounded-full animate-pulse" />
          </>
        )}
        {status === "success" && !isRunning && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#36B460] rounded-full zoom-in" />
        )}
        {status === "failed" && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full zoom-in" />
        )}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className="text-white font-semibold text-sm truncate max-w-[180px]"
            title={actionDescription}
          >
            {actionDescription}
          </p>
          {status === "running" && (
            <span className="text-xs text-white/50 whitespace-nowrap">
              Running...
            </span>
          )}
          {status === "success" && !isRunning && (
            <span className="text-xs text-[#36B460] whitespace-nowrap">✓</span>
          )}
          {status === "failed" && (
            <span className="text-xs text-red-500 whitespace-nowrap">✗</span>
          )}
        </div>
        {duration && status !== "running" && (
          <p className="text-white/60 text-xs">
            {duration < 1000
              ? `${duration}ms`
              : `${(duration / 1000).toFixed(1)}s`}
          </p>
        )}
        {actionLink && (
          <p className="text-[#36B460] text-xs mt-0.5 font-medium flex items-center gap-1">
            View artifact →
          </p>
        )}
      </div>
    </div>
  );

  if (actionLink) {
    return (
      <a
        href={actionLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        title={`Open ${actionDescription}`}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};
