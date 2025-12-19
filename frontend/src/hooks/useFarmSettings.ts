import { useState, useCallback } from 'react';
import { settingsService } from '@/services/settings.service';
import { FarmSettings, UpdateFarmSettingsData, DeleteFarmAccountData } from '@/types/settings.types';

export const useFarmSettings = () => {
  const [farmSettings, setFarmSettings] = useState<FarmSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    message: '',
  });

  // Show alert
  const showAlert = useCallback((type: 'success' | 'error', message: string) => {
    setAlert({
      isOpen: true,
      type,
      message,
    });
  }, []);

  // Close alert
  const closeAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Fetch farm settings
  const fetchFarmSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.getFarmSettings();
      setFarmSettings(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch farm settings';
      showAlert('error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // Update farm settings
  const updateFarmSettings = useCallback(async (data: UpdateFarmSettingsData) => {
    try {
      setLoading(true);
      
      const response = await settingsService.updateFarmSettings(data);
      
      // Update local state if successful
      if (farmSettings) {
        setFarmSettings({
          ...farmSettings,
          name: data.name || farmSettings.name,
          location: data.location || farmSettings.location,
        });
      }
      
      showAlert('success', response.message || "Farm settings updated successfully");
      
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update farm settings';
      showAlert('error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [farmSettings, showAlert]);

  // Delete farm account
  const deleteFarmAccount = useCallback(async (data: DeleteFarmAccountData) => {
    try {
      setLoading(true);
      
      const response = await settingsService.deleteFarmAccount(data);
      
      showAlert('success', response.message || "Farm account deleted successfully");
      
      // Clear local storage and redirect to login after 1.5 seconds
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        window.location.href = '/login';
      }, 1500);
      
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete farm account';
      showAlert('error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  return {
    farmSettings,
    loading,
    alert,
    closeAlert,
    fetchFarmSettings,
    updateFarmSettings,
    deleteFarmAccount,
  };
};