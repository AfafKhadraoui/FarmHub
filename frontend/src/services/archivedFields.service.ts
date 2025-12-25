import api from '@/lib/api';
import { FieldsResponse, UpdateFieldResponse, DeleteResponse } from '@/types/archivedfields.types';

export const fieldService = {
  // Restore field - simple endpoint
  async restoreField(fieldId: string): Promise<DeleteResponse> {
    const response = await api.patch(`/fields/${fieldId}/restore`);
    return response.data;
  },

  // Permanent delete
  async permanentDeleteField(fieldId: string): Promise<DeleteResponse> {
    const response = await api.delete(`/fields/${fieldId}/permanent`);
    return response.data;
  },

  // Get archived fields
  async getArchivedFields(page = 1, limit = 100): Promise<FieldsResponse> {
    const response = await api.get('/fields/paginated', {
      params: { 
        page, 
        limit, 
        history: true 
      }
    });
    return response.data;
  }
};