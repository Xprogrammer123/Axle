// components-beta/chat/MessageRenderer.tsx
'use client';

import React from 'react';
import { MessageType, type AgentMessage } from '@/types/messages';
import { getCardComponent } from './ToolRegistry';

// Import all card components
import GmailDraftCard from './renderers/gmail/GmailDraftCard';
import GmailThreadCard from './renderers/gmail/GmailThreadCard';
import CalendarEventCard from './renderers/calendar/CalendarEventCard';
import CalendarScheduleCard from './renderers/calendar/CalendarScheduleCard';
import GitHubPRCard from './renderers/github/GitHubPRCard';
import GitHubIssueCard from './renderers/github/GitHubIssueCard';
import XPostCard from './renderers/twitter/XPostCard';
import XThreadCard from './renderers/twitter/XThreadCard';
import SlackMessageCard from './renderers/slack/SlackMessageCard';
import SlackChannelCard from './renderers/slack/SlackChannelCard';
import SlackUserCard from './renderers/slack/SlackUserCard';
import SheetsRowCard from './renderers/sheets/SheetRowCard';
import DriveFileCard from './renderers/drive/DriveFileCard';
import WebScraperCard from './renderers/web/WebScraperCard';
import CronScheduleCard from './renderers/web/CronScheduleCard';

interface MessageRendererProps {
    message: AgentMessage;
    onApprove?: (approvalId: string) => void;
    onReject?: (approvalId: string, reason?: string) => void;
    onSendEmail?: (data: any) => void;
    onSendSlackMessage?: (data: any) => void;
    onCreateChannel?: (data: any) => void;
    onMergePR?: (data: any) => void;
    onCommentIssue?: (data: any) => void;
    onPostTweet?: (data: any) => void;
    onShareFile?: (data: any) => void;
    onApplyChanges?: (data: any) => void;
    onToggleSchedule?: (data: any) => void;
}

/**
 * MessageRenderer - Renders different message types with appropriate UI cards
 * 
 * Uses the ToolRegistry to dynamically select the correct card component
 * based on the message type. Falls back to a default renderer for unknown types.
 */
export default function MessageRenderer({
    message,
    onApprove,
    onReject,
    onSendEmail,
    onSendSlackMessage,
    onCreateChannel,
    onMergePR,
    onCommentIssue,
    onPostTweet,
    onShareFile,
    onApplyChanges,
    onToggleSchedule,
}: MessageRendererProps) {
    // Use the registry to get the appropriate component
    const CardComponent = getCardComponent(message.type);

    if (CardComponent) {
        // Render the card with message.data as the data prop
        return <CardComponent data={message.data} />;
    }

    // Manual switch statement for cards that need special handlers
    switch (message.type) {
        // Gmail Cards
        case MessageType.GMAIL_DRAFT:
            return <GmailDraftCard data={message.data} onSend={onSendEmail} />;

        case MessageType.GMAIL_THREAD:
            return <GmailThreadCard data={message.data} />;

        // Calendar Cards
        case MessageType.CALENDAR_EVENT:
            return <CalendarEventCard data={message.data} />;

        case MessageType.CALENDAR_SCHEDULE:
            return <CalendarScheduleCard data={message.data} />;

        // GitHub Cards
        case MessageType.GITHUB_PR:
            return <GitHubPRCard data={message.data} onMerge={onMergePR} />;

        case MessageType.GITHUB_ISSUE:
            return <GitHubIssueCard data={message.data} onComment={onCommentIssue} />;

        // X (Twitter) Cards
        case MessageType.X_POST:
            return <XPostCard data={message.data} onPost={onPostTweet} />;

        case MessageType.X_THREAD:
            return <XThreadCard data={message.data} onPost={onPostTweet} />;

        // Slack Cards
        case MessageType.SLACK_MESSAGE:
            return <SlackMessageCard data={message.data} onSend={onSendSlackMessage} />;

        case MessageType.SLACK_CHANNEL:
            return <SlackChannelCard data={message.data} onCreate={onCreateChannel} />;

        case MessageType.SLACK_USER:
            return (
                <SlackUserCard
                    data={message.data}
                    onMessage={() => {
                        // Open DM with this user
                        if (onSendSlackMessage && message.data) {
                            onSendSlackMessage({
                                channel: (message.data as any).id, // DM uses user ID as channel
                                message: '',
                            });
                        }
                    }}
                    onInvite={() => {
                        // Trigger invite flow
                        console.log('Invite user:', (message.data as any)?.id);
                    }}
                />
            );

        // Sheets Cards
        case MessageType.SHEETS_ROW:
            return <SheetsRowCard data={message.data} onApply={onApplyChanges} />;

        // Drive Cards
        case MessageType.DRIVE_FILE:
            return <DriveFileCard data={message.data} onShare={onShareFile} />;

        // Web & Utility Cards
        case MessageType.WEB_SCRAPER:
            return <WebScraperCard data={message.data} />;

        case MessageType.CRON_SCHEDULE:
            return <CronScheduleCard data={message.data} onToggle={onToggleSchedule} />;

        // Text and system messages
        case MessageType.TEXT:
            return (
                <div className="prose prose-invert max-w-none">
                    <p className="text-white">{message.content || (message.data as any)?.text}</p>
                </div>
            );

        case MessageType.THINKING:
            return (
                <div className="flex items-center gap-2 text-purple-400 text-sm">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span>{message.content || (message.data as any)?.text || 'Thinking...'}</span>
                </div>
            );

        case MessageType.TOOL_CALL:
            return (
                <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span>Using tool: {(message.data as any)?.toolName}</span>
                </div>
            );

        case MessageType.TOOL_RESULT:
            return (
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">
                        Tool: {(message.data as any)?.toolName}
                    </div>
                    <pre className="text-sm text-gray-300 overflow-auto">
                        {JSON.stringify((message.data as any)?.result, null, 2)}
                    </pre>
                </div>
            );

        case MessageType.APPROVAL_REQUIRED:
            return (
                <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <span className="text-yellow-300 font-semibold">Approval Required</span>
                    </div>
                    <p className="text-white mb-4">
                        {(message.data as any)?.reason || `Approve ${(message.data as any)?.toolName}?`}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onApprove?.((message.data as any)?.toolCallId)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => onReject?.((message.data as any)?.toolCallId)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            );

        case MessageType.ERROR:
            return (
                <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-red-300 font-semibold">Error</span>
                    </div>
                    <p className="text-white">{(message.data as any)?.message || message.content}</p>
                </div>
            );

        // Default fallback
        default:
            return (
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50">
                    <div className="text-xs text-gray-500 mb-2">
                        Unknown message type: {message.type}
                    </div>
                    <pre className="text-sm text-gray-400 overflow-auto">
                        {JSON.stringify(message, null, 2)}
                    </pre>
                </div>
            );
    }
}
