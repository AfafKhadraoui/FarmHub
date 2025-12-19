export interface ArchivedField {
  id: string;
  name: string;
  size: number;
  cropType?: string;
  status: string;
  progress: number;
  active: boolean;
  lastUpdatedBy?: string;
  statusNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FieldsResponse {
  data: ArchivedField[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface UpdateFieldResponse {
  message: string;
  field: {
    id: string;
    name: string;
    size: number;
    cropType?: string;
    status: string;
    progress: number;
    active: boolean;
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  error?: string;
}