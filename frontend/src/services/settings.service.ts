import api from '@/lib/api';
import {
  FarmSettings,
  UpdateFarmSettingsData,
  DeleteFarmAccountData,
  DeleteFarmResponse,
  UpdateFarmResponse
} from '@/types/settings.types';

export const settingsService = {
  // Farm Settings
  async getFarmSettings(): Promise<FarmSettings> {
    const response = await api.get('/api/settings/farm');
    return response.data;
  },

  async updateFarmSettings(data: UpdateFarmSettingsData): Promise<UpdateFarmResponse> {
    const response = await api.put('/api/settings/farm', data);
    return response.data;
  },

  async deleteFarmAccount(data: DeleteFarmAccountData): Promise<DeleteFarmResponse> {
    const response = await api.delete('/api/settings/farm', { data });
    return response.data;
  }
};