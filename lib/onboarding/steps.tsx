import { Step } from "onborda";

export const steps = [
    {
        tour: "main",
        steps: [
            {
                icon: "👋",
                title: "Welcome to Axle",
                content: "This is your command center. Ask Axle to do anything from here.",
                selector: "#dashboard-magic-input",
                side: "bottom",
                showControls: true,
                pointerPadding: 8,
                pointerRadius: 12,
            },
            {
                icon: "🧭",
                title: "Navigation",
                content: "Navigate between your Agents, Apps, and Settings here.",
                selector: "#sidebar-nav",
                side: "right",
                showControls: true,
                pointerPadding: 0,
                pointerRadius: 12,
            },
            {
                icon: "🤖",
                title: "Your AI Workforce",
                content: "All your custom agents live here. Create specialized agents for any task.",
                selector: "#dashboard-agents-card",
                side: "bottom", // Better for mobile
                showControls: true,
                pointerPadding: 8,
                pointerRadius: 12,
            },
            {
                icon: "🔌",
                title: "Connect Your Tools",
                content: "Link GitHub, Google, and X to give your agents superpowers.",
                selector: "#dashboard-integrations-card",
                side: "top", // Better for mobile
                showControls: true,
                pointerPadding: 8,
                pointerRadius: 12,
            },
            {
                icon: "💬",
                title: "Recent Conversations",
                content: "Jump back into your recent chats and tasks right from here.",
                selector: "#dashboard-recent-conversations",
                side: "top",
                showControls: true,
                pointerPadding: 8,
                pointerRadius: 12,
            },
            {
                icon: "🔔",
                title: "Stay Updated",
                content: "Check here for alerts and updates on your agents' activities.",
                selector: "#header-notifications-btn",
                side: "bottom-right",
                showControls: true,
                pointerPadding: 6,
                pointerRadius: 16,
            }
        ]
    }
];