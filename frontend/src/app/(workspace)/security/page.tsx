'use client';

import { useState } from 'react';
import {
  Shield,
  Lock,
  Key,
  Server,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Clock,
  Database,
  FileText,
  UserCheck,
} from 'lucide-react';

interface SecurityBestPractice {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  description: string;
  details: string[];
}

interface PrivacyItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SecurityPage() {
  const [expandedPractice, setExpandedPractice] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const securityPractices: SecurityBestPractice[] = [
    {
      id: 'passwords',
      title: 'Strong Passwords',
      icon: <Lock size={24} />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Create strong, unique passwords to protect your account',
      details: [
        'Use at least 12 characters with a mix of letters, numbers, and symbols',
        'Avoid using personal information like birthdays or names',
        'Never reuse passwords across multiple accounts',
        'Consider using a password manager for secure storage',
        'Change your password if you suspect any unauthorized access',
      ],
    },
    {
      id: 'account',
      title: 'Account Security',
      icon: <Shield size={24} />,
      iconBg: 'bg-green-50',
      iconColor: 'text-[var(--admin-primary)]',
      description: 'Recognize and prevent unauthorized access attempts',
      details: [
        'Be cautious of phishing emails asking for your credentials',
        'Never share your password with anyone, including support staff',
        'Log out from shared or public devices after use',
        'Review your account activity regularly for suspicious behavior',
        'Enable email notifications for new device logins',
      ],
    },
    {
      id: 'devices',
      title: 'Device Security',
      icon: <Server size={24} />,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Keep your devices updated and secure',
      details: [
        'Install security updates and patches promptly',
        'Use antivirus software and keep it updated',
        'Only download FarmHub from official sources',
        'Lock your devices with passwords or biometric authentication',
        'Be cautious when connecting to public WiFi networks',
      ],
    },
    {
      id: 'backup',
      title: 'Data Backup',
      icon: <Database size={24} />,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-[var(--admin-secondary)]',
      description: 'Regularly backup your important farm data',
      details: [
        'FarmHub automatically backs up your data daily',
        'Export your data periodically for personal records',
        'Store backups in multiple secure locations',
        'Verify backup integrity regularly',
        'Keep backup access credentials separate and secure',
      ],
    },
  ];

  const securityFeatures = [
    {
      title: 'End-to-End Encryption',
      description: 'All your data is encrypted both in transit and at rest using industry-standard protocols',
      icon: <Lock size={20} />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Secure Authentication',
      description: 'Multi-layered authentication system with secure token management',
      icon: <Key size={20} />,
      iconBg: 'bg-green-50',
      iconColor: 'text-[var(--admin-primary)]',
    },
    {
      title: 'Regular Backups',
      description: 'Automated daily backups ensure your farm data is never lost',
      icon: <Server size={20} />,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: '24/7 Monitoring',
      description: 'Continuous security monitoring to detect and prevent threats',
      icon: <Shield size={20} />,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-[var(--admin-secondary)]',
    },
  ];

  const privacyItems: PrivacyItem[] = [
    {
      title: 'Your Data Rights',
      description: 'We collect only essential data to provide FarmHub services: farm information, field data, task management, and user profiles. You have full control over your data.',
      icon: <FileText size={20} />,
    },
    {
      title: 'Data Storage',
      description: 'Your data is stored on secure, encrypted servers with multiple redundancy layers. We use industry-leading cloud infrastructure with 99.9% uptime.',
      icon: <Database size={20} />,
    },
    {
      title: 'Data Retention',
      description: 'Active account data is retained as long as you use FarmHub. Deleted data is permanently removed within 30 days, excluding legally required records.',
      icon: <Clock size={20} />,
    },
    {
      title: 'Data Access',
      description: 'Only you and authorized farm members can access your data. Our staff access data only for support requests with your explicit permission.',
      icon: <UserCheck size={20} />,
    },
  ];

  const securityChecklist = [
    'Use a strong, unique password for your FarmHub account',
    'Never share your login credentials with anyone',
    'Log out when using shared or public devices',
    'Review your active sessions regularly',
    'Keep your contact information up to date',
    'Be cautious of suspicious emails or messages',
    'Report any security concerns immediately',
  ];

  const togglePractice = (id: string) => {
    setExpandedPractice(expandedPractice === id ? null : id);
  };

  const toggleChecklistItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[var(--admin-primary)] to-[#81C784] p-12 shadow-lg">
        <div className="relative z-10 flex items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Shield size={44} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <h1
              className="text-[40px] font-bold text-white mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Security & Privacy
            </h1>
            <p
              className="text-[18px] text-white/90"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Your trust is our priority. Learn how FarmHub protects your data and account.
            </p>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-white/10" />
      </div>

      {/* Security Best Practices */}
      <div>
        <h2
          className="text-[24px] font-semibold mb-6"
          style={{ color: 'var(--admin-text-dark)', fontFamily: 'Poppins, sans-serif' }}
        >
          Security Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {securityPractices.map((practice) => (
            <div
              key={practice.id}
              className="rounded-[24px] border bg-white p-8 shadow-sm transition-all hover:shadow-md"
              style={{ borderColor: 'var(--admin-border)' }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`h-14 w-14 rounded-xl ${practice.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <div className={practice.iconColor}>{practice.icon}</div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-[18px] font-semibold mb-2"
                    style={{ color: 'var(--admin-text-dark)', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {practice.title}
                  </h3>
                  <p
                    className="text-[14px] leading-relaxed"
                    style={{ color: 'var(--admin-text-muted)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {practice.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => togglePractice(practice.id)}
                className="flex items-center gap-2 text-[14px] font-semibold transition-colors hover:text-[var(--admin-primary)] mt-4"
                style={{
                  color: expandedPractice === practice.id ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {expandedPractice === practice.id ? 'Show less' : 'Learn more'}
                {expandedPractice === practice.id ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {expandedPractice === practice.id && (
                <div className="mt-4 space-y-2 animate-in slide-in-from-top-2">
                  {practice.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-[var(--admin-primary)] mt-0.5 flex-shrink-0" />
                      <p
                        className="text-[13px] leading-relaxed"
                        style={{ color: 'var(--admin-text-dark)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Features Overview */}
      <div>
        <h2
          className="text-[24px] font-semibold mb-6"
          style={{ color: 'var(--admin-text-dark)', fontFamily: 'Poppins, sans-serif' }}
        >
          How FarmHub Protects You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-[24px] border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
              style={{ borderColor: 'var(--admin-border)' }}
            >
              <div className={`h-12 w-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4`}>
                <div className={feature.iconColor}>{feature.icon}</div>
              </div>
              <h3
                className="text-[16px] font-semibold mb-2"
                style={{ color: 'var(--admin-text-dark)', fontFamily: 'Poppins, sans-serif' }}
              >
                {feature.title}
              </h3>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: 'var(--admin-text-muted)', fontFamily: 'Inter, sans-serif' }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Data Protection */}
      <div>
        <h2
          className="text-[24px] font-semibold mb-6"
          style={{ color: 'var(--admin-text-dark)', fontFamily: 'Poppins, sans-serif' }}
        >
          Privacy & Data Protection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {privacyItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[24px] border bg-white p-8 shadow-sm"
              style={{ borderColor: 'var(--admin-border)' }}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <div className="text-slate-600">{item.icon}</div>
                </div>
                <div>
                  <h3
                    className="text-[16px] font-semibold mb-2"
                    style={{ color: 'var(--admin-text-dark)', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[14px] leading-relaxed"
                    style={{ color: 'var(--admin-text-muted)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            className="rounded-[24px] border bg-white p-8 shadow-sm"
            style={{ borderColor: 'var(--admin-border)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-[var(--admin-primary)]" />
              </div>
              <div>
                <h3
                  className="text-[18px] font-semibold"
                  style={{ color: 'var(--admin-text-dark)', fontFamily: 'Poppins, sans-serif' }}
                >
                  Security Checklist
                </h3>
                <p
                  className="text-[13px]"
                  style={{ color: 'var(--admin-text-muted)', fontFamily: 'Inter, sans-serif' }}
                >
                  Follow these recommendations to keep your account secure
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {securityChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => toggleChecklistItem(idx)}
                >
                  <div
                    className={`h-5 w-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      checkedItems.has(idx)
                        ? 'bg-[var(--admin-primary)]'
                        : 'border-2 border-gray-300'
                    }`}
                  >
                    {checkedItems.has(idx) && (
                      <CheckCircle2 size={14} className="text-white" />
                    )}
                  </div>
                  <p
                    className={`text-[14px] leading-relaxed ${
                      checkedItems.has(idx) ? 'line-through' : ''
                    }`}
                    style={{
                      color: checkedItems.has(idx) ? 'var(--admin-text-muted)' : 'var(--admin-text-dark)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <div
            className="rounded-[24px] border bg-gradient-to-br from-red-50 to-orange-50 p-8 shadow-sm h-full"
            style={{ borderColor: 'var(--admin-border)' }}
          >
            <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h3
              className="text-[18px] font-semibold mb-3"
              style={{ color: 'var(--admin-text-dark)', fontFamily: 'Poppins, sans-serif' }}
            >
              Security Concerns?
            </h3>
            <p
              className="text-[14px] leading-relaxed mb-6"
              style={{ color: 'var(--admin-text-muted)', fontFamily: 'Inter, sans-serif' }}
            >
              If you notice any suspicious activity or have security concerns, contact us immediately.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-red-600" />
                <a
                  href="mailto:security@farmhub.com"
                  className="text-[14px] font-medium text-red-600 hover:underline"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  security@farmhub.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-red-600" />
                <span
                  className="text-[13px]"
                  style={{ color: 'var(--admin-text-muted)', fontFamily: 'Inter, sans-serif' }}
                >
                  Response within 24 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
