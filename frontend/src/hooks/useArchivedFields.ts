import { useState, useCallback } from 'react';
import { fieldService } from '@/services/archivedFields.service';

export const useArchivedFields = () => {
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArchivedFields = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fieldService.getArchivedFields();
      
      // Transform data for UI
      const transformedFields = response.data.map(field => ({
        id: field.id.toString(), // Keep as string for UI
        name: field.name,
        size: `${field.size} hectares`,
        location: 'Field Location',
        lastCrop: field.cropType || 'Unknown',
        archivedDate: new Date(field.updatedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        reason: field.statusNotes || 'Archived',
        progress: field.progress
      }));
      
      setFields(transformedFields);
      return transformedFields;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch archived fields';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreField = useCallback(async (fieldId: string) => {
    try {
      setLoading(true);
      const response = await fieldService.restoreField(fieldId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to restore field');
      }
      
      // Remove from local state
      setFields(prev => prev.filter(field => field.id !== fieldId));
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to restore field';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const permanentDeleteField = useCallback(async (fieldId: string) => {
    try {
      setLoading(true);
      const response = await fieldService.permanentDeleteField(fieldId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete field');
      }
      
      // Remove from local state
      setFields(prev => prev.filter(field => field.id !== fieldId));
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete field';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fields,
    loading,
    error,
    fetchArchivedFields,
    restoreField,
    permanentDeleteField,
    setError
  };
};