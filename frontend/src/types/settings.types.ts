// Farm Settings Types Only
export interface FarmSettings {
  id: string;
  name: string;
  location: string;
  joinCode: string;
  createdAt: string;
  totalFields: number;
  totalWorkers: number;
  activeTasks: number;
}

export interface UpdateFarmSettingsData {
  name?: string;
  location?: string;
}

export interface DeleteFarmAccountData {
  password: string;
  confirmation: string;
}

export interface DeleteFarmResponse {
  message: string;
}

export interface UpdateFarmResponse {
  message: string;
}