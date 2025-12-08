"use client";
import { useState } from "react";

type Integration = {
  id: number;
  name: string;
  status: "connected" | "disconnected" | "warning";
  statusText: string;
  warningText: string | null;
  buttonText: string;
  enabled: boolean;
};

const initialIntegrations: Integration[] = [
  { id: 1, name: "Google", status: "connected", statusText: "Connected", warningText: null, buttonText: "Disconnect", enabled: true },
  { id: 2, name: "GitHub", status: "warning", statusText: "Warning: Please reconnect your app.", warningText: "Warning: Please reconnect your app.", buttonText: "Reconnect", enabled: true },
  { id: 3, name: "Slack", status: "disconnected", statusText: "Not Connected", warningText: null, buttonText: "Connect", enabled: false },
  { id: 4, name: "X (Twitter)", status: "disconnected", statusText: "Not Connected", warningText: null, buttonText: "Connect", enabled: false },
  { id: 5, name: "Instagram", status: "warning", statusText: "Error: Authentication expired.", warningText: "Error: Authentication expired.", buttonText: "Re-authenticate", enabled: true },
];

export default function App() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);

  const handleToggle = (id: number) => {
    setIntegrations(prev =>
      prev.map(i => (i.id === id ? { ...i, enabled: !i.enabled } : i))
    );
  };

  const handleAction = (id: number) => {
    const integration = integrations.find(i => i.id === id);
    if (integration) alert(`Action for ${integration.name}: ${integration.buttonText}`);
  };

  return (
    <div className="bg-black p-10 grid grid-cols-1 md:grid-cols-3 gap-7">
      {integrations.map((integration) => {
        const { id, name, status, statusText, warningText, buttonText, enabled } = integration;

        const statusColor =
          status === "connected"
            ? "text-[#00c776]"
            : status === "disconnected"
            ? "text-red-500"
            : "text-white/50";

        const warningColor = "text-yellow-500";

        return (
          <div
            key={id}
            className="bg-white/4 rounded-4xl p-8 flex flex-col justify-between h-full shadow-2xl"
          >
            <div>
              <h3 className="text-white text-2xl font-semibold mb-4">{name}</h3>
              <div className="h-10 flex items-center mb-6 bg-white/4 p-6 rounded-2xl">
                {warningText ? (
                  <p className={`${warningColor} text-sm font-medium`}>{warningText}</p>
                ) : (
                  <p className={`${statusColor} text-sm font-medium`}>{statusText}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <button
                className="bg-base hover:bg-base/90 text-white font-semibold py-4 rounded-full w-full text-center transition-colors"
                onClick={() => handleAction(id)}
              >
                {buttonText}
              </button>

              <div className="flex flex-col items-center ml-4">
                <span className="text-white/60 text-[10px] mb-1 whitespace-nowrap">
                  Enable/Disable
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleToggle(id)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#00c776] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
                </label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
