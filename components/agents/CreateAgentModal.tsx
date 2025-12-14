"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { agentsAPI, oauthAPI } from "@/lib/api";
import {
  Sparkle,
  GithubLogo,
  SlackLogo,
  GoogleLogo,
  InstagramLogo,
  XLogo,
} from "@phosphor-icons/react";

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserIntegration {
  _id: string;
  name: string;
}

const availableIntegrations = [
  { id: "github", name: "GitHub", icon: GithubLogo, color: "text-gray-400" },
  { id: "slack", name: "Slack", icon: SlackLogo, color: "text-purple-400" },
  { id: "google", name: "Google", icon: GoogleLogo, color: "text-blue-400" },
  {
    id: "instagram",
    name: "Instagram",
    icon: InstagramLogo,
    color: "text-pink-400",
  },
  { id: "x", name: "X (Twitter)", icon: XLogo, color: "text-white" },
];

// All available tools that should be accessible to agents
const allTools = [
  // GitHub Tools
  "list_repos",
  "search_gitHub",
  "search_repos",
  "list_pull_requests",
  "get_pull_request",
  "comment_pull_request",
  "list_issues",
  "get_issue",
  "create_issue",
  "update_issue",
  "comment_issue",
  "list_commits",
  "get_commit",
  "list_branches",
  "get_branch",
  "create_branch",
  "list_releases",
  "create_release",
  "star_repository",
  "get_repository_stars",
  "list_workflows",
  "get_workflow_runs",
  "list_notifications",
  "mark_notification_read",
  // Google Tools
  "listCalendarEvents",
  "list_calendars",
  "create_calendar_event",
  "list_gmail_messages",
  "get_gmail_message",
  "send_gmail",
  "list_drive_files",
  "get_drive_file",
  "create_drive_folder",
  "read_sheet",
  "write_to_sheet",
  // Slack Tools
  "sendSlackMessage",
  "list_channels",
  "open_dm",
  "get_channel_history",
  "reply_to_message",
  "get_thread_replies",
  "add_reaction",
  "remove_reaction",
  "list_slack_users",
  "get_slack_user_info",
  "upload_slack_file",
  "list_slack_files",
  "search_slack_messages",
  // Instagram Tools
  "postInstagramMedia",
  "list_posts",
  "send_instagram_dm",
  "get_instagram_profile",
  "get_instagram_stories",
  "comment_on_post",
  "like_post",
  "get_post_comments",
  "follow_user_instagram",
  "get_followers",
  // X/Twitter Tools
  "postXTweet",
  "list_x_posts",
  "send_x_dm",
  "get_x_timeline",
  "reply_to_tweet",
  "like_tweet",
  "retweet",
  "get_tweet",
  "search_tweets",
  "get_mentions",
  "follow_user",
  "get_user_profile",
  // Web & HTTP Tools
  "scrape_url",
  "http_request",
  "search_web",
  // Email Tools
  "send_email",
  "read_email",
  "search_emails",
  // Notification Tools
  "send_notification",
  "create_alert",
  // Data Analysis Tools
  "analyze_text",
  "extract_data",
  "compare_data",
  "aggregate_data",
  // Internal Axle Tools
  "axleTool",
  "central_ai",
  // Agent Management Tools
  "create_agent",
  "update_agent",
  "delete_agent",
  "list_agents",
  "get_agent",
  "schedule_agent",
  "unschedule_agent",
];

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>(
    []
  );
  const [integrationsLoading, setIntegrationsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    tools: "*",
    integrations: [],
    schedule: {
      enabled: false,
      intervalMinutes: 5,
    },
  });

  // Fetch user's integrations when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchIntegrations();
    }
  }, [isOpen]);

  const fetchIntegrations = async () => {
    setIntegrationsLoading(true);
    try {
      const data = await oauthAPI.listIntegrations();
      setUserIntegrations(data.integrations || []);
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
      setUserIntegrations([]);
    } finally {
      setIntegrationsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast("Please enter an agent name", "error");
      return;
    }

    setLoading(true);
    try {
      // Map selected integration names to their database IDs
      const mappedIntegrations = formData.integrations
        .map((integrationName) => {
          const integration = userIntegrations.find(
            (int) => int.name === integrationName
          );
          return {
            name: integrationName,
            integrationId: integration?._id || null,
          };
        })
        .filter((int) => int.integrationId !== null);

      await agentsAPI.create({
        name: formData.name,
        description: formData.description,
        systemPrompt: formData.systemPrompt || formData.description,
        integrations: formData.integrations.map((id) => {
          const integration = availableIntegrations.find((int) => int.id === id);
          return {
            name: integration?.name || id,
            integrationId: id,
          };
        }),
        schedule: formData.schedule,
      });

      showToast("Agent created successfully!", "success");
      onSuccess();
      onClose();
      setStep(1);
      setFormData({
        name: "",
        description: "",
        systemPrompt: "",
        tools: "*",
        integrations: [],
        schedule: { enabled: false, intervalMinutes: 5 },
      });
    } catch (error) {
      showToast(error.message || "Failed to create agent", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegration = (integrationId: string) => {
    setFormData((prev) => ({
      ...prev,
      integrations: prev.integrations.includes(integrationId)
        ? prev.integrations.filter((id) => id !== integrationId)
        : [...prev.integrations, integrationId],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Agent" size="lg">
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center">
                <motion.div
                  animate={{
                    scale: step >= s ? 1.1 : 1,
                    backgroundColor:
                      step >= s ? "#00c776" : "rgba(255,255,255,0.1)",
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20"
                >
                  {step > s ? "✓" : s}
                </motion.div>
              </div>
              {s < 3 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded ${
                    step > s ? "bg-base" : "bg-white/10"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">
                Agent Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., GitHub PR Reviewer"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-base transition-all"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                placeholder="What does this agent do?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-base transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">
                Instructions / System Prompt
              </label>
              <textarea
                value={formData.systemPrompt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    systemPrompt: e.target.value,
                  }))
                }
                rows={5}
                placeholder="Detailed instructions for the agent..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-base transition-all resize-none"
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: integrations & Integrations */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-white/60 text-sm font-medium mb-4">
                Select integrations & Integrations
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableIntegrations.map((integration) => {
                  const Icon = integration.icon;
                  const isSelected = formData.integrations.includes(integration.id);
                  return (
                    <motion.button
                      key={integration.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleIntegration(integration.id)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "bg-base/20 border-base"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={24} className={integration.color} />
                        <span className="text-white font-medium">{integration.name}</span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <Sparkle
                              size={20}
                              className="text-base"
                              weight="fill"
                            />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div>
                <label className="text-white font-medium">
                  Enable Scheduling
                </label>
                <p className="text-white/50 text-xs mt-1">
                  Run agent automatically on a schedule
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.schedule.enabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        enabled: e.target.checked,
                      },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-base transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>

            {formData.schedule.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">
                    Run Every (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.schedule.intervalMinutes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        schedule: {
                          ...prev.schedule,
                          intervalMinutes: parseInt(e.target.value) || 5,
                        },
                      }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-base transition-all"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <button
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onClose();
            }}
            className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 rounded-full bg-base hover:bg-base/90 text-white font-medium transition-all"
            >
              Next
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading || !formData.name.trim()}
              className="px-6 py-3 rounded-full bg-base hover:bg-base/90 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkle size={18} weight="fill" />
                  Create Agent
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </Modal>
  );
};
