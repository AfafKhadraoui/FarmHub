"use client";

import {
  MapPin,
  Users,
  CheckSquare,
  Calendar,
  Mail,
  ArrowLeft,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";

interface FarmDetails {
  id: number;
  name: string;
  location: string;
  joinCode: string;
  createdAt: string;
  owner: { id: number; name: string; email: string } | null;
  workers: { id: number; name: string; email: string }[];
  fields: {
    id: number;
    name: string;
    size: number;
    cropType: string;
    status: string;
  }[];
  stats: {
    totalWorkers: number;
    totalFields: number;
    activeTasks: number;
    completedTasks: number;
  };
}

interface FarmDetailsPageProps {
  farmId: number;
  onBack: () => void;
}

export default function FarmDetailsPage({ farmId, onBack }: FarmDetailsPageProps) {
  const [farm, setFarm] = useState<FarmDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        const res = await fetch(
          `http://localhost:5000/admin/farms/${farmId}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to load farm: ${res.status}`);
        }

        const data: FarmDetails = await res.json();
        setFarm(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load farm details");
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, [farmId]);

  if (loading) {
    return (
      <p className="text-sm text-[var(--admin-text-muted)]">
        Loading farm details...
      </p>
    );
  }

  if (error || !farm) {
    return (
      <div className="space-y-3">
        <button
          onClick={onBack}
          className="text-sm text-[var(--admin-primary)] underline"
        >
          ← Back to farms
        </button>
        <p className="text-sm text-red-600">
          {error || "Failed to load farm details."}
        </p>
      </div>
    );
  }

  // From here, use real `farm` data instead of static:
  // farm.name, farm.location, farm.owner, farm.fields, farm.stats, etc.
  // Example header (replace your old dummy header with this real data):

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] transition-colors"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          <ArrowLeft size={20} />
          Back to Farms
        </button>

        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-dark)] hover:bg-gray-50 transition-all"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            <Edit size={16} />
            Edit Farm
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div
        className="bg-white border border-[var(--admin-border)] rounded-2xl p-8 mb-6"
        style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1
              className="text-[var(--admin-text-dark)] text-3xl mb-2"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800 }}
            >
              {farm.name}
            </h1>
            <p
              className="text-[var(--admin-text-muted)]"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
            >
              {farm.location}
            </p>
          </div>
          {/* You can derive a status from activeTasks, etc. */}
          <span
            className="px-3 py-1 rounded-full text-xs bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            ● Active
          </span>
        </div>

        {/* Example info row using real owner + joinCode */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <Users size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Owner
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {farm.owner?.name || "Unassigned"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <Mail size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Email
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {farm.owner?.email || "-"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <Calendar size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Created
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {new Date(farm.createdAt).toLocaleDateString("en-GB")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <CheckSquare size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Join code
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {farm.joinCode}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You can now wire your existing stats, fields list, workers list, etc.
          using farm.fields, farm.workers, and farm.stats instead of static arrays. */}
    </div>
  );
}
