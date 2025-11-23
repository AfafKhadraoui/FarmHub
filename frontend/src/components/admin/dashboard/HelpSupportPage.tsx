"use client";

import { Github, Book, Mail, MessageSquare, CheckCircle } from "lucide-react";

export default function HelpSupportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Help & Support
        </h1>
        <p
          className="text-gray-600 mt-1"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Quick access to resources
        </p>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Quick Links
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="https://github.com/AfafKhadraoui/FarmHub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#4baf47] transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Github size={24} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h3
                className="font-semibold text-gray-900"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                GitHub Repo
              </h3>
              <p
                className="text-sm text-gray-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                View source code
              </p>
            </div>
          </a>

          <a
            href="https://ensia-team-khokiiem.atlassian.net/jira/software/projects/SP/boards/34/backlog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#4baf47] transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Book size={24} className="text-blue-600" strokeWidth={2} />
            </div>
            <div>
              <h3
                className="font-semibold text-gray-900"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Jira Board
              </h3>
              <p
                className="text-sm text-gray-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Project management
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Team Contact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Team Contact
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <MessageSquare
              size={20}
              className="text-gray-600"
              strokeWidth={2}
            />
            <div className="flex-1">
              <p
                className="text-sm text-gray-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Slack Channel
              </p>
              <a
                href="https://app.slack.com/client/T09QWSVTCLV/C09RD8U297T"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#4baf47] hover:underline"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Open Slack Workspace
              </a>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200">
            <p
              className="text-sm text-gray-600 mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Team Members
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Khadraoui Afaf",
                "Loubna Bensaoula",
                "Lounis Abderaouf",
                "Ilyas Aniour",
                "Belkeis Salhi",
              ].map((member, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {member}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          System Info
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span
              className="text-gray-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Version
            </span>
            <span
              className="font-medium text-gray-900"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              1.0.0
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span
              className="text-gray-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Status
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle
                size={16}
                className="text-green-600"
                strokeWidth={2}
              />
              <span
                className="font-medium text-green-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                All systems operational
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span
              className="text-gray-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Last Deploy
            </span>
            <span
              className="font-medium text-gray-900"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              2 hours ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
