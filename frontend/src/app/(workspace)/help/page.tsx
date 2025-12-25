"use client";

import { useState } from "react";
import {
  BookOpen,
  MessageCircle,
  Mail,
  MapPin,
  ClipboardList,
  Users,
  Cloud,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface HelpSection {
  title: string;
  icon: React.ReactNode;
  description: string;
  faqs: FAQItem[];
}

export default function HelpPage() {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [expandedFAQ, setExpandedFAQ] = useState<{
    section: number;
    faq: number;
  } | null>(null);

  const supportCards = [
    {
      title: "Documentation",
      description: "Detailed guides and API docs.",
      icon: <BookOpen size={24} className="text-blue-600" />,
      bgColor: "bg-blue-50",
      link: "View Docs →",
      linkColor: "text-blue-600",
    },
    {
      title: "Live Chat",
      description: "Chat with our support team.",
      icon: <MessageCircle size={24} className="text-green-600" />,
      bgColor: "bg-green-50",
      link: "Start Chat →",
      linkColor: "text-green-600",
    },
    {
      title: "Email Support",
      description: "Get help via email.",
      icon: <Mail size={24} className="text-purple-600" />,
      bgColor: "bg-purple-50",
      link: "support@farmhub.com",
      linkColor: "text-purple-600",
    },
  ];

  const helpSections: HelpSection[] = [
    {
      title: "Farm Management",
      icon: <MapPin size={20} className="text-gray-600" />,
      description: "Manage your fields and crops efficiently.",
      faqs: [
        {
          question: "How do I add a new field?",
          answer:
            'Go to the "Fields" page and click the "Add Field" button. Enter the field details such as name, size, and crop type, then save.',
        },
        {
          question: "How do I update crop status?",
          answer:
            'Select a field from the list, click "Edit", and update the status (e.g., from "Planted" to "Growing").',
        },
        {
          question: "Can I track multiple crops per field?",
          answer:
            "Currently, each field supports one crop type at a time. You can update the crop type when you rotate crops.",
        },
      ],
    },
    {
      title: "Task Management",
      icon: <ClipboardList size={20} className="text-gray-600" />,
      description: "Create and assign tasks to your team.",
      faqs: [
        {
          question: "How do I create a new task?",
          answer:
            'Navigate to the Tasks page and click "Create Task". Fill in the task details including title, description, priority, due date, and assign it to workers.',
        },
        {
          question: "How can I assign tasks to multiple workers?",
          answer:
            "When creating or editing a task, select multiple workers from the dropdown. Each worker will receive a notification about the assignment.",
        },
        {
          question: "What do the different task priorities mean?",
          answer:
            "Low priority tasks can be done when time permits, Medium priority should be completed soon, and High priority tasks need immediate attention.",
        },
        {
          question: "How do I mark a task as complete?",
          answer:
            'Open the task details and click "Mark as Complete". The task will show a green checkmark and move to the completed section.',
        },
      ],
    },
    {
      title: "Team Collaboration",
      icon: <Users size={20} className="text-gray-600" />,
      description: "Manage workers and collaborate effectively.",
      faqs: [
        {
          question: "How do I invite workers to join my farm?",
          answer:
            'Go to the Workers page and click "Invite Worker". You can send an email invitation or share your unique farm join code.',
        },
        {
          question: "Can I remove a worker from my farm?",
          answer:
            "Yes, farm owners can remove workers from the Workers page. This will unassign them from all current tasks.",
        },
        {
          question: "How do I view worker activity?",
          answer:
            "Check the Dashboard for an overview of worker activity, or visit the Workers page to see individual worker task completion rates.",
        },
      ],
    },
    {
      title: "Weather & Planning",
      icon: <Cloud size={20} className="text-gray-600" />,
      description: "Use weather data to plan farm activities.",
      faqs: [
        {
          question: "How do I check the weather forecast?",
          answer:
            "Click on the Weather icon in the sidebar to view a 7-day forecast for your farm location, including temperature, precipitation, and wind speed.",
        },
        {
          question: "Can I plan tasks based on weather?",
          answer:
            "Yes, use the weather forecast to schedule irrigation on dry days and plan outdoor tasks when conditions are favorable.",
        },
      ],
    },
  ];

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const toggleFAQ = (sectionIndex: number, faqIndex: number) => {
    if (
      expandedFAQ?.section === sectionIndex &&
      expandedFAQ?.faq === faqIndex
    ) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ({ section: sectionIndex, faq: faqIndex });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Help & Support
        </h1>
        <p
          className="text-gray-600"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Guides and support for managing your farm efficiently.
        </p>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {supportCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-100`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">{card.icon}</div>
              <div className="flex-1">
                <h3
                  className="font-semibold text-gray-900 mb-1"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm text-gray-600 mb-3"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {card.description}
                </p>
                <a
                  href={
                    card.title === "Email Support"
                      ? `mailto:${card.link}`
                      : "#"
                  }
                  className={`text-sm font-medium ${card.linkColor} hover:underline`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {card.link}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Sections */}
      <div className="space-y-4">
        {helpSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(sectionIndex)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <div className="text-left">
                  <h3
                    className="font-semibold text-gray-900"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {section.title}
                  </h3>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {section.description}
                  </p>
                </div>
              </div>
              {expandedSection === sectionIndex ? (
                <ChevronUp className="text-gray-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </button>

            {/* FAQs */}
            {expandedSection === sectionIndex && (
              <div className="border-t border-gray-100">
                {section.faqs.map((faq, faqIndex) => (
                  <div key={faqIndex} className="border-b border-gray-100 last:border-b-0">
                    <button
                      onClick={() => toggleFAQ(sectionIndex, faqIndex)}
                      className="w-full px-6 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <CheckCircle
                        className="text-green-500 flex-shrink-0 mt-0.5"
                        size={18}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className="font-medium text-gray-900"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {faq.question}
                          </p>
                          {expandedFAQ?.section === sectionIndex &&
                          expandedFAQ?.faq === faqIndex ? (
                            <ChevronUp className="text-gray-400 flex-shrink-0" size={18} />
                          ) : (
                            <ChevronDown className="text-gray-400 flex-shrink-0" size={18} />
                          )}
                        </div>
                        {expandedFAQ?.section === sectionIndex &&
                          expandedFAQ?.faq === faqIndex && (
                            <p
                              className="mt-2 text-sm text-gray-600 leading-relaxed"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              {faq.answer}
                            </p>
                          )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <p
          className="text-sm text-gray-600 text-center"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Can't find what you're looking for?{" "}
          <a
            href="mailto:support@farmhub.com"
            className="text-[#4baf47] font-medium hover:underline"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}
