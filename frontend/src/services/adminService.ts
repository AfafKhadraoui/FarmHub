/**
 * Admin Service
 *
 * This service handles all API calls for the platform admin dashboard.
 * Replace the mock data with actual API endpoints once backend is ready.
 */

import api from "@/lib/api";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DashboardMetrics {
  totalFarms: number;
  totalUsers: number;
  totalTasks: number;
  totalFields: number;
  farmsToday: number;
  usersToday: number;
  tasksToday: number;
  fieldsToday: number;
}

export interface FarmGrowthData {
  month: string;
  farms: number;
}

export interface RecentFarm {
  name: string;
  owner: string;
  location: string;
  created: string; // relative time like "2h ago"
}

export interface Activity {
  id: number;
  type: "farm_created" | "user_registered" | "milestone" | "field_added";
  title: string;
  subtitle: string;
  time: string; // relative time
  color: string;
}

export interface Farm {
  id: number;
  name: string;
  owner: string;
  email: string;
  location: string;
  created: string; // ISO date or formatted date
  fields: number;
  tasks: number;
  workers: number;
  status: "active" | "inactive";
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Farm Owner" | "Worker";
  farm: string;
  joined: string; // ISO date
  status: "active" | "inactive";
}

export interface UserGrowthData {
  month: string;
  users: number;
}

export interface TaskVolumeData {
  month: string;
  tasks: number;
}

export interface ActiveFarmData {
  farm: string;
  tasks: number;
}

export interface UserDistributionData {
  name: string;
  value: number;
}

export interface LocationData {
  location: string;
  farms: number;
}

// ============================================================================
// API SERVICE
// ============================================================================

export const adminService = {
  // ============================================================================
  // DASHBOARD OVERVIEW
  // ============================================================================

  /**
   * Get dashboard metrics (total counts and today's changes)
   * GET /api/admin/metrics
   */
  getMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const response = await api.get<DashboardMetrics>("/admin/metrics");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      throw error;
    }
  },

  /**
   * Get farm growth data for chart
   * GET /api/admin/analytics/farm-growth
   */
  getFarmGrowth: async (): Promise<FarmGrowthData[]> => {
    try {
      const response = await api.get<FarmGrowthData[]>(
        "/admin/analytics/farm-growth"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch farm growth:", error);
      throw error;
    }
  },

  /**
   * Get recently created farms (last 5)
   * GET /api/admin/farms/recent
   */
  getRecentFarms: async (): Promise<RecentFarm[]> => {
    try {
      const response = await api.get<RecentFarm[]>("/admin/farms/recent");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch recent farms:", error);
      throw error;
    }
  },

  /**
   * Get real-time activity feed
   * GET /api/admin/activities
   */
  getActivities: async (): Promise<Activity[]> => {
    try {
      const response = await api.get<Activity[]>("/admin/activities");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      throw error;
    }
  },

  // ============================================================================
  // FARMS MANAGEMENT
  // ============================================================================

  /**
   * Get all farms with optional filters
   * GET /api/admin/farms
   *
   * @param params - Query parameters
   * @param params.search - Search term for farm name or owner
   * @param params.status - Filter by status (active/inactive)
   * @param params.page - Page number
   * @param params.limit - Items per page
   */
  getAllFarms: async (params?: {
    search?: string;
    status?: "active" | "inactive" | "all";
    page?: number;
    limit?: number;
  }): Promise<{ farms: Farm[]; total: number }> => {
    try {
      const response = await api.get<{ farms: Farm[]; total: number }>(
        "/admin/farms",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch farms:", error);
      throw error;
    }
  },

  /**
   * Get single farm details
   * GET /api/admin/farms/:id
   */
  getFarmById: async (farmId: number): Promise<Farm> => {
    try {
      const response = await api.get<Farm>(`/admin/farms/${farmId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch farm:", error);
      throw error;
    }
  },

  /**
   * Update farm status (activate/deactivate)
   * PATCH /api/admin/farms/:id/status
   */
  updateFarmStatus: async (
    farmId: number,
    status: "active" | "inactive"
  ): Promise<void> => {
    try {
      await api.patch(`/admin/farms/${farmId}/status`, { status });
    } catch (error) {
      console.error("Failed to update farm status:", error);
      throw error;
    }
  },

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  /**
   * Get all users with optional filters
   * GET /api/admin/users
   *
   * @param params - Query parameters
   * @param params.search - Search term for name or email
   * @param params.role - Filter by role (owner/worker)
   * @param params.status - Filter by status (active/inactive)
   * @param params.page - Page number
   * @param params.limit - Items per page
   */
  getAllUsers: async (params?: {
    search?: string;
    role?: "owner" | "worker" | "all";
    status?: "active" | "inactive" | "all";
    page?: number;
    limit?: number;
  }): Promise<{ users: User[]; total: number }> => {
    try {
      const response = await api.get<{ users: User[]; total: number }>(
        "/admin/users",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },

  /**
   * Get single user details
   * GET /api/admin/users/:id
   */
  getUserById: async (userId: number): Promise<User> => {
    try {
      const response = await api.get<User>(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  },

  /**
   * Export users to CSV
   * GET /api/admin/users/export
   */
  exportUsers: async (params?: {
    role?: "owner" | "worker" | "all";
    status?: "active" | "inactive" | "all";
  }): Promise<Blob> => {
    try {
      const response = await api.get("/admin/users/export", {
        params,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Failed to export users:", error);
      throw error;
    }
  },

  /**
   * Update user status (activate/deactivate)
   * PATCH /api/admin/users/:id/status
   */
  updateUserStatus: async (
    userId: number,
    status: "active" | "inactive"
  ): Promise<void> => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { status });
    } catch (error) {
      console.error("Failed to update user status:", error);
      throw error;
    }
  },

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  /**
   * Get user growth analytics
   * GET /api/admin/analytics/user-growth
   *
   * @param timeRange - Time range (7, 30, 90, 365 days)
   */
  getUserGrowth: async (timeRange: number = 30): Promise<UserGrowthData[]> => {
    try {
      const response = await api.get<UserGrowthData[]>(
        "/admin/analytics/user-growth",
        {
          params: { timeRange },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user growth:", error);
      throw error;
    }
  },

  /**
   * Get task volume analytics
   * GET /api/admin/analytics/task-volume
   *
   * @param timeRange - Time range (7, 30, 90, 365 days)
   */
  getTaskVolume: async (timeRange: number = 30): Promise<TaskVolumeData[]> => {
    try {
      const response = await api.get<TaskVolumeData[]>(
        "/admin/analytics/task-volume",
        {
          params: { timeRange },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch task volume:", error);
      throw error;
    }
  },

  /**
   * Get most active farms
   * GET /api/admin/analytics/active-farms
   *
   * @param limit - Number of farms to return (default: 10)
   */
  getMostActiveFarms: async (limit: number = 10): Promise<ActiveFarmData[]> => {
    try {
      const response = await api.get<ActiveFarmData[]>(
        "/admin/analytics/active-farms",
        {
          params: { limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch active farms:", error);
      throw error;
    }
  },

  /**
   * Get user distribution (owners vs workers)
   * GET /api/admin/analytics/user-distribution
   */
  getUserDistribution: async (): Promise<UserDistributionData[]> => {
    try {
      const response = await api.get<UserDistributionData[]>(
        "/admin/analytics/user-distribution"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user distribution:", error);
      throw error;
    }
  },

  /**
   * Get farms by location
   * GET /api/admin/analytics/location-distribution
   */
  getLocationDistribution: async (): Promise<LocationData[]> => {
    try {
      const response = await api.get<LocationData[]>(
        "/admin/analytics/location-distribution"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch location distribution:", error);
      throw error;
    }
  },

  /**
   * Get complete analytics data
   * GET /api/admin/analytics
   *
   * @param timeRange - Time range (7, 30, 90, 365 days)
   */
  getCompleteAnalytics: async (timeRange: number = 30) => {
    try {
      const [
        userGrowth,
        taskVolume,
        activeFarms,
        userDistribution,
        locationDistribution,
      ] = await Promise.all([
        adminService.getUserGrowth(timeRange),
        adminService.getTaskVolume(timeRange),
        adminService.getMostActiveFarms(),
        adminService.getUserDistribution(),
        adminService.getLocationDistribution(),
      ]);

      return {
        userGrowth,
        taskVolume,
        activeFarms,
        userDistribution,
        locationDistribution,
      };
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      throw error;
    }
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Download blob as file
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Handle CSV export
 */
export const handleExportUsers = async (params?: {
  role?: "owner" | "worker" | "all";
  status?: "active" | "inactive" | "all";
}) => {
  try {
    const blob = await adminService.exportUsers(params);
    const filename = `users-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    downloadBlob(blob, filename);
  } catch (error) {
    console.error("Failed to export users:", error);
    alert("Failed to export users. Please try again.");
  }
};
