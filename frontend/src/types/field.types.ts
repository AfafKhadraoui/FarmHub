export interface Field {
  id: number;
  name: string;
  size: number;
  cropType: string;
  status: "idle" | "planted" | "growing" | "harvesting";
  plantedDate?: string;
  harvestDate?: string;
  active: boolean;
  farmId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFieldData {
  name: string;
  size: number;
  cropType: string;
  status: string;
  plantedDate?: string;
  harvestDate?: string;
}
