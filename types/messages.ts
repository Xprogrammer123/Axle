// Frontend Message Types - mirrors backend types for type safety

export enum MessageType {
  TEXT = 'TEXT',
  THINKING = 'THINKING',
  TOOL_CALL = 'TOOL_CALL',
  TOOL_RESULT = 'TOOL_RESULT',
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED',
  ERROR = 'ERROR',

  // Gmail Cards
  GMAIL_DRAFT = 'GMAIL_DRAFT',
  GMAIL_THREAD = 'GMAIL_THREAD',
  GMAIL_SEARCH = 'GMAIL_SEARCH',
  GMAIL_SIGNATURE = 'GMAIL_SIGNATURE',
  GMAIL_LABEL = 'GMAIL_LABEL',

  // Calendar Cards
  CALENDAR_EVENT = 'CALENDAR_EVENT',
  CALENDAR_SCHEDULE = 'CALENDAR_SCHEDULE',
  CALENDAR_ATTENDEE = 'CALENDAR_ATTENDEE',
  CALENDAR_SETTINGS = 'CALENDAR_SETTINGS',

  // GitHub Cards
  GITHUB_PR = 'GITHUB_PR',
  GITHUB_ISSUE = 'GITHUB_ISSUE',
  GITHUB_REPO = 'GITHUB_REPO',
  GITHUB_COMMIT = 'GITHUB_COMMIT',
  GITHUB_ACTION = 'GITHUB_ACTION',

  // X (Twitter) Cards
  X_POST = 'X_POST',
  X_THREAD = 'X_THREAD',
  X_ANALYTICS = 'X_ANALYTICS',

  // Slack Cards
  SLACK_MESSAGE = 'SLACK_MESSAGE',
  SLACK_CHANNEL = 'SLACK_CHANNEL',
  SLACK_USER = 'SLACK_USER',

  // Sheets & Docs Cards
  SHEETS_ROW = 'SHEETS_ROW',
  SHEETS_CHART = 'SHEETS_CHART',
  DOCS_DRAFT = 'DOCS_DRAFT',
  DOCS_PERMISSION = 'DOCS_PERMISSION',

  // Drive Cards
  DRIVE_FILE = 'DRIVE_FILE',
  DRIVE_UPLOAD = 'DRIVE_UPLOAD',
  DRIVE_FOLDER = 'DRIVE_FOLDER',

  // Web & Utility Cards
  WEB_SCRAPER = 'WEB_SCRAPER',
  HTTP_REQUEST = 'HTTP_REQUEST',
  CRON_SCHEDULE = 'CRON_SCHEDULE',
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface BaseMessage {
  id: string;
  type: MessageType;
  role: MessageRole;
  createdAt: string;
  content?: string;
  data?: any;
  metadata?: Record<string, unknown>;
}

// Slack Types
export interface SlackMessageData {
  channel: string;
  channelName: string;
  message: string;
  mentions?: string[];
  isThread?: boolean;
  threadTs?: string;
  isPrivate?: boolean;
}

export interface SlackChannelData {
  channelName: string;
  description?: string;
  isPrivate: boolean;
  members?: string[];
  purpose?: string;
}

export interface SlackUserData {
  id: string;
  name: string;
  realName: string;
  email?: string;
  phone?: string;
  title?: string;
  timezone?: string;
  status?: {
    emoji?: string;
    text?: string;
  };
  isBot?: boolean;
  isAdmin?: boolean;
  profileImage?: string;
}

// Gmail Types
export interface GmailDraftData {
  to: Array<{ name?: string; email: string }>;
  cc?: Array<{ name?: string; email: string }>;
  bcc?: Array<{ name?: string; email: string }>;
  subject: string;
  body: string;
  attachments?: Array<{ filename: string; mimeType?: string; sizeBytes?: number }>;
  isDraft?: boolean;
  emailId?: string;
}

export interface GmailThreadData {
  subject: string;
  messages: Array<{
    from: string;
    date: string;
    snippet: string;
    body?: string;
  }>;
  totalMessages: number;
}

// Calendar Types
export interface CalendarEventData {
  title: string;
  date: string;
  time: string;
  duration: string;
  location?: string;
  meetLink?: string;
  attendees: string[];
  description?: string;
  color?: string;
}

export interface CalendarScheduleData {
  date: string;
  schedule: Array<{
    time: string;
    event?: {
      title: string;
      duration: string;
      color: string;
    };
    isFree: boolean;
  }>;
  conflicts: number;
}

// GitHub Types
export interface GitHubPRData {
  repo: string;
  number: number;
  title: string;
  author: string;
  status: 'open' | 'closed' | 'merged';
  filesChanged: number;
  additions: number;
  deletions: number;
  branch: string;
  targetBranch: string;
  url?: string;
}

export interface GitHubIssueData {
  repo: string;
  number: number;
  title: string;
  author: string;
  status: 'open' | 'closed';
  labels: string[];
  comments: number;
}

// X (Twitter) Types
export interface XPostData {
  text: string;
  images?: string[];
  characterCount: number;
  scheduledFor?: string;
}

export interface XThreadData {
  tweets: string[];
  totalCharacters: number;
}

// Sheets Types
export interface SheetsRowData {
  sheetName: string;
  rowNumber: number;
  oldValues: Record<string, any>;
  newValues: Record<string, any>;
  columns: string[];
}

// Drive Types
export interface DriveFileData {
  name: string;
  type: string;
  size: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink?: string;
  downloadLink?: string;
}

// Web Types
export interface WebScraperData {
  url: string;
  title: string;
  extractedText: string;
  wordCount: number;
  scrapedAt: string;
}

export interface CronScheduleData {
  schedule: string;
  nextRun: string;
  timezone: string;
  description: string;
  enabled: boolean;
}

// Union type for all message types
export type AgentMessage = BaseMessage & {
  data?: 
    | SlackMessageData
    | SlackChannelData
    | SlackUserData
    | GmailDraftData
    | GmailThreadData
    | CalendarEventData
    | CalendarScheduleData
    | GitHubPRData
    | GitHubIssueData
    | XPostData
    | XThreadData
    | SheetsRowData
    | DriveFileData
    | WebScraperData
    | CronScheduleData
    | any;
};
