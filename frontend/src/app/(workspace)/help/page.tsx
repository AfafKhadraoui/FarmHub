"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Book,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Users,
  MapPin,
  CheckSquare,
  Cloud,
  Settings,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface HelpSection {
  title: string;
  icon: any;
  description: string;
  items: FaqItem[];
}

export default function HelpPage() {
  const { user } = useAuth();
  const isWorker = user?.role === "worker";

  const adminSections: HelpSection[] = [
    {
      title: "Farm Management",
      icon: MapPin,
      description: "Manage your fields and crops efficiently.",
      items: [
        {
          question: "How do I add a new field?",
          answer:
            "Go to the 'Fields' page and click the 'Add Field' button. Enter the field details such as name, size, and crop type, then save.",
        },
        {
          question: "How do I update crop status?",
          answer:
            "Select a field from the list, click 'Edit', and update the status (e.g., form 'Planted' to 'Growing').",
        },
      ],
    },
    {
      title: "Task Management",
      icon: CheckSquare,
      description: "Assign and track tasks for your workers.",
      items: [
        {
          question: "How do I create a task?",
          answer:
            "Navigate to the 'Tasks' page, click 'Create Task', fill in the details, and assign it to a worker or a field.",
        },
        {
          question: "Can I change a task's priority?",
          answer:
            "Yes, edit the task and select a new priority level (Low, Medium, High) from the dropdown.",
        },
      ],
    },
    {
      title: "Worker Management",
      icon: Users,
      description: "Manage your team and their roles.",
      items: [
        {
          question: "How do I invite a new worker?",
          answer:
            "Go to the 'Workers' page and click 'Add Worker'. You'll need to provide their email and basic information.",
        },
        {
          question: "How do I view worker performance?",
          answer:
            "Click on a worker's name in the list to view their profile, assigned tasks, and completion history.",
        },
      ],
    },
  ];

  const workerSections: HelpSection[] = [
    {
      title: "My Tasks",
      icon: CheckSquare,
      description: "View and complete your assigned tasks.",
      items: [
        {
          question: "How do I see my tasks?",
          answer:
            "Your assigned tasks are listed on your Dashboard and the 'My Tasks' page.",
        },
        {
          question: "How do I mark a task as complete?",
          answer:
            "Open the task details and click the 'Mark as Complete' button. You can also add notes if needed.",
        },
      ],
    },
    {
      title: "Field Information",
      icon: MapPin,
      description: "Access information about the fields you work on.",
      items: [
        {
          question: "Where can I find field details?",
          answer:
            "Go to the 'Fields' page to see a map and list of all fields, including their current crop and status.",
        },
      ],
    },
  ];

  const commonSections: HelpSection[] = [
    {
      title: "Account & Settings",
      icon: Settings,
      description: "Manage your profile and preferences.",
      items: [
        {
          question: "How do I change my password?",
          answer:
            "Go to 'My Profile' or 'Settings' and look for the security section to update your password.",
        },
        {
          question: "How do I update my contact info?",
          answer:
            "Navigate to 'My Profile' and click 'Edit Profile' to update your phone number or email.",
        },
      ],
    },
  ];

  const sections = isWorker
    ? [...workerSections, ...commonSections]
    : [...adminSections, ...commonSections];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Help & Support
        </h1>
        <p
          className="text-gray-600 text-lg"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {isWorker
            ? "Find answers to common questions and learn how to use the platform."
            : "Guides and support for managing your farm efficiently."}
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Book size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Documentation</h3>
            <p className="text-sm text-gray-600 mb-3">
              Detailed guides and API docs.
            </p>
            <a
              href="#"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              View Docs &rarr;
            </a>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-lg text-green-600">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-3">
              Chat with our support team.
            </p>
            <button className="text-green-600 text-sm font-medium hover:underline">
              Start Chat &rarr;
            </button>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get help via email.
            </p>
            <a
              href="mailto:support@farmhub.com"
              className="text-purple-600 text-sm font-medium hover:underline"
            >
              support@farmhub.com
            </a>
          </div>
        </div>
      </div>

      {/* Help Sections */}
      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, index) => (
          <SectionCard key={index} section={section} />
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          Still need help? Call us at{" "}
          <span className="font-medium text-gray-900">+1 (555) 123-4567</span>
        </p>
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: HelpSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      <div
        className="p-6 flex items-start gap-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
          <section.icon size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {section.title}
            </h3>
            {isOpen ? (
              <ChevronUp size={20} className="text-gray-400" />
            ) : (
              <ChevronDown size={20} className="text-gray-400" />
            )}
          </div>
          <p className="text-gray-600 mt-1">{section.description}</p>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 pt-0 pl-[5.5rem]">
          <div className="space-y-4 border-t border-gray-100 pt-4">
            {section.items.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle size={16} className="text-[#4CAF50]" />
                  {item.question}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed ml-6">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
