import { useState, useEffect, useCallback } from 'react';
import { Client } from '../types';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      const allClients = await storageService.getAllClients();
      setClients(allClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const saveClient = useCallback(
    async (client: Client) => {
      try {
        await storageService.saveClient(client);
        
        // Schedule notification if follow-up date exists
        if (client.followUpDate) {
          await notificationService.scheduleFollowUpNotification(client);
        } else {
          await notificationService.cancelFollowUpNotification(client.id);
        }
        
        await loadClients();
        return true;
      } catch (error) {
        console.error('Error saving client:', error);
        return false;
      }
    },
    [loadClients]
  );

  const deleteClient = useCallback(
    async (id: string) => {
      try {
        await notificationService.cancelFollowUpNotification(id);
        await storageService.deleteClient(id);
        await loadClients();
        return true;
      } catch (error) {
        console.error('Error deleting client:', error);
        return false;
      }
    },
    [loadClients]
  );

  const getClientsByFollowUpDate = useCallback(
    (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return clients.filter((client) => {
        if (!client.followUpDate) return false;
        const followUpDateStr = client.followUpDate.split('T')[0];
        return followUpDateStr === dateStr;
      });
    },
    [clients]
  );

  const getTodaysFollowUps = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return getClientsByFollowUpDate(today);
  }, [getClientsByFollowUpDate]);

  const getUpcomingFollowUps = useCallback((limit: number = 7) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = clients
      .filter((client) => {
        if (!client.followUpDate) return false;
        const followUpDate = new Date(client.followUpDate);
        followUpDate.setHours(0, 0, 0, 0);
        return followUpDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.followUpDate!);
        const dateB = new Date(b.followUpDate!);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, limit);

    return upcoming;
  }, [clients]);

  return {
    clients,
    loading,
    loadClients,
    saveClient,
    deleteClient,
    getTodaysFollowUps,
    getUpcomingFollowUps,
    getClientsByFollowUpDate,
  };
};

