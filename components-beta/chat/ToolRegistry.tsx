// components/chat/ToolCardRegistry.tsx
// This is the master registry that maps tool names to their UI cards

import { MessageType } from '@/types/messages';

// Gmail Cards
import GmailDraftCard from './renderers/gmail/GmailDraftCard';
import GmailThreadCard from './renderers/gmail/GmailThreadCard';

// Calendar Cards
import CalendarEventCard from './renderers/calendar/CalendarEventCard';
import CalendarScheduleCard from './renderers/calendar/CalendarScheduleCard';

// GitHub Cards
import GitHubPRCard from './renderers/github/GitHubPRCard';
import GitHubIssueCard from './renderers/github/GitHubIssueCard';

// X (Twitter) Cards
import XPostCard from './renderers/twitter/XPostCard';
import XThreadCard from './renderers/twitter/XThreadCard';

// Slack Cards
import SlackMessageCard from './renderers/slack/SlackMessageCard';
import SlackChannelCard from './renderers/slack/SlackChannelCard';
import SlackUserCard from './renderers/slack/SlackUserCard';

// Sheets & Drive Cards
import SheetsRowCard from './renderers/sheets/SheetRowCard';
import DriveFileCard from './renderers/drive/DriveFileCard';

// Web & Utility Cards
import WebScraperCard from './renderers/web/WebScraperCard';
import CronScheduleCard from './renderers/web/CronScheduleCard';

/**
 * MASTER TOOL CARD REGISTRY
 * 
 * Maps tool execution results to their corresponding UI cards.
 * Add new mappings here when you create new tool cards.
 */
export const TOOL_CARD_REGISTRY: Record<string, MessageType> = {
  // Gmail (5 cards)
  'gmail_compose': MessageType.GMAIL_DRAFT,
  'gmail_send': MessageType.GMAIL_DRAFT,
  'gmail_get_thread': MessageType.GMAIL_THREAD,
  'gmail_search': MessageType.GMAIL_SEARCH,
  'gmail_update_signature': MessageType.GMAIL_SIGNATURE,
  'gmail_add_label': MessageType.GMAIL_LABEL,

  // Google Calendar (4 cards)
  'google_calendar_get_event': MessageType.CALENDAR_EVENT,
  'google_calendar_list_events': MessageType.CALENDAR_SCHEDULE,
  'google_calendar_get_attendees': MessageType.CALENDAR_ATTENDEE,
  'google_calendar_update_settings': MessageType.CALENDAR_SETTINGS,

  // GitHub (5 cards)
  'github_get_pr': MessageType.GITHUB_PR,
  'github_create_pr': MessageType.GITHUB_PR,
  'github_get_issue': MessageType.GITHUB_ISSUE,
  'github_create_issue': MessageType.GITHUB_ISSUE,
  'github_get_repo': MessageType.GITHUB_REPO,
  'github_get_commit': MessageType.GITHUB_COMMIT,
  'github_get_workflow': MessageType.GITHUB_ACTION,

  // X / Twitter (3 cards)
  'twitter_post': MessageType.X_POST,
  'twitter_create_thread': MessageType.X_THREAD,
  'twitter_get_analytics': MessageType.X_ANALYTICS,

  // Slack (10 cards)
  'slack_send_message': MessageType.SLACK_MESSAGE,
  'slack_post_message': MessageType.SLACK_MESSAGE,
  'slack_post_to_channel': MessageType.SLACK_MESSAGE,
  'slack_create_channel': MessageType.SLACK_CHANNEL,
  'slack_get_channel': MessageType.SLACK_CHANNEL,
  'slack_get_channel_info': MessageType.SLACK_CHANNEL,
  'slack_list_channels': MessageType.SLACK_CHANNEL,
  'slack_get_user': MessageType.SLACK_USER,
  'slack_get_user_info': MessageType.SLACK_USER,
  'slack_lookup_user': MessageType.SLACK_USER,
  'slack_invite_user': MessageType.SLACK_USER,

  // Google Sheets & Docs (4 cards)
  'sheets_update_row': MessageType.SHEETS_ROW,
  'sheets_get_chart': MessageType.SHEETS_CHART,
  'docs_append': MessageType.DOCS_DRAFT,
  'docs_share': MessageType.DOCS_PERMISSION,

  // Google Drive (3 cards)
  'drive_get_file': MessageType.DRIVE_FILE,
  'drive_upload': MessageType.DRIVE_UPLOAD,
  'drive_move_file': MessageType.DRIVE_FOLDER,

  // Web & Utility (3 cards)
  'web_scrape': MessageType.WEB_SCRAPER,
  'http_request': MessageType.HTTP_REQUEST,
  'cron_schedule': MessageType.CRON_SCHEDULE,
};

/**
 * Component registry for rendering tool cards
 */
export const TOOL_CARD_COMPONENTS = {
  // Gmail
  [MessageType.GMAIL_DRAFT]: GmailDraftCard,
  [MessageType.GMAIL_THREAD]: GmailThreadCard,
  // [MessageType.GMAIL_SEARCH]: GmailSearchCard, // TODO: Create these
  // [MessageType.GMAIL_SIGNATURE]: GmailSignatureCard,
  // [MessageType.GMAIL_LABEL]: GmailLabelCard,

  // Calendar
  [MessageType.CALENDAR_EVENT]: CalendarEventCard,
  [MessageType.CALENDAR_SCHEDULE]: CalendarScheduleCard,
  // [MessageType.CALENDAR_ATTENDEE]: CalendarAttendeeCard,
  // [MessageType.CALENDAR_SETTINGS]: CalendarSettingsCard,

  // GitHub
  [MessageType.GITHUB_PR]: GitHubPRCard,
  [MessageType.GITHUB_ISSUE]: GitHubIssueCard,
  // [MessageType.GITHUB_REPO]: GitHubRepoCard,
  // [MessageType.GITHUB_COMMIT]: GitHubCommitCard,
  // [MessageType.GITHUB_ACTION]: GitHubActionCard,

  // X (Twitter)
  [MessageType.X_POST]: XPostCard,
  [MessageType.X_THREAD]: XThreadCard,
  // [MessageType.X_ANALYTICS]: XAnalyticsCard,

  // Slack
  [MessageType.SLACK_MESSAGE]: SlackMessageCard,
  [MessageType.SLACK_CHANNEL]: SlackChannelCard,
  [MessageType.SLACK_USER]: SlackUserCard,

  // Sheets & Drive
  [MessageType.SHEETS_ROW]: SheetsRowCard,
  [MessageType.DRIVE_FILE]: DriveFileCard,
  // [MessageType.SHEETS_CHART]: SheetsChartCard,
  // [MessageType.DOCS_DRAFT]: DocsDraftCard,
  // [MessageType.DOCS_PERMISSION]: DocsPermissionCard,
  // [MessageType.DRIVE_UPLOAD]: DriveUploadCard,
  // [MessageType.DRIVE_FOLDER]: DriveFolderCard,

  // Web & Utility
  [MessageType.WEB_SCRAPER]: WebScraperCard,
  [MessageType.CRON_SCHEDULE]: CronScheduleCard,
  // [MessageType.HTTP_REQUEST]: HttpRequestCard,
};

/**
 * Determines which card to render for a given tool result
 */
export function getToolCard(toolName: string): MessageType | null {
  return TOOL_CARD_REGISTRY[toolName] || null;
}

/**
 * Gets the component for a specific message type
 */
export function getCardComponent(messageType: MessageType): React.ComponentType<any> | null {
  return TOOL_CARD_COMPONENTS[messageType] || null;
}

// Update your MessageType enum in src/types/messages.ts with these new types:
/*
export enum MessageType {
  TEXT = 'text',
  THINKING = 'thinking',
  TOOL_CALL = 'tool_call',
  TOOL_RESULT = 'tool_result',
  APPROVAL_REQUIRED = 'approval_required',
  ERROR = 'error',
  
  // Gmail Cards
  GMAIL_DRAFT = 'gmail_draft',
  GMAIL_THREAD = 'gmail_thread',
  GMAIL_SEARCH = 'gmail_search',
  GMAIL_SIGNATURE = 'gmail_signature',
  GMAIL_LABEL = 'gmail_label',
  
  // Calendar Cards
  CALENDAR_EVENT = 'calendar_event',
  CALENDAR_SCHEDULE = 'calendar_schedule',
  CALENDAR_ATTENDEE = 'calendar_attendee',
  CALENDAR_SETTINGS = 'calendar_settings',
  
  // GitHub Cards
  GITHUB_PR = 'github_pr',
  GITHUB_ISSUE = 'github_issue',
  GITHUB_REPO = 'github_repo',
  GITHUB_COMMIT = 'github_commit',
  GITHUB_ACTION = 'github_action',
  
  // X (Twitter) Cards
  X_POST = 'x_post',
  X_THREAD = 'x_thread',
  X_ANALYTICS = 'x_analytics',
  
  // Slack Cards
  SLACK_MESSAGE = 'slack_message',
  SLACK_CHANNEL = 'slack_channel',
  SLACK_USER = 'slack_user',
  
  // Sheets & Docs Cards
  SHEETS_ROW = 'sheets_row',
  SHEETS_CHART = 'sheets_chart',
  DOCS_DRAFT = 'docs_draft',
  DOCS_PERMISSION = 'docs_permission',
  
  // Drive Cards
  DRIVE_FILE = 'drive_file',
  DRIVE_UPLOAD = 'drive_upload',
  DRIVE_FOLDER = 'drive_folder',
  
  // Web & Utility Cards
  WEB_SCRAPER = 'web_scraper',
  HTTP_REQUEST = 'http_request',
  CRON_SCHEDULE = 'cron_schedule',
}
*/

/**
 *   return <DefaultMessage message={message} />;
 * }
 */

interface ToolCallCardProps {
  toolName: string;
  status: "running" | "success" | "failed";
  params?: Record<string, unknown>;
  result?: unknown;
  duration?: number;
}

export function ToolCallCard({ toolName, status, result }: ToolCallCardProps) {
  const messageType = getToolCard(toolName);
  if (!messageType) return null;

  const CardComponent = getCardComponent(messageType);
  if (!CardComponent) return null;

  // Most cards expect a 'data' prop. We assume 'result' contains the data.
  // We cast result to any to bypass strict type checking for the generic component
  return <CardComponent data={result} />;
}