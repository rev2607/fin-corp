import { useState, useEffect, useCallback } from 'react';
import { Client } from '../types';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';
import { isToday as isTodayDate, getLocalDateString, getDateStringFromISO } from '../utils/dateUtils';

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
        // Save client first - this is the critical operation
        await storageService.saveClient(client);
        
        // Schedule notification if follow-up date exists (non-blocking)
        // Wrap in try-catch so notification errors don't prevent saving
        try {
          if (client.followUpDate) {
            await notificationService.scheduleFollowUpNotification(client);
          } else {
            await notificationService.cancelFollowUpNotification(client.id);
          }
        } catch (notificationError) {
          // Log but don't fail - notifications are optional
          console.warn('Notification scheduling failed (non-critical):', notificationError);
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
    return clients.filter((client) => {
      if (!client.followUpDate) return false;
      try {
        return isTodayDate(client.followUpDate);
      } catch (error) {
        console.error('Error checking if date is today:', error, client.followUpDate);
        return false;
      }
    });
  }, [clients]);

  const getOverdueFollowUps = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = getLocalDateString(today);
    
    return clients
      .filter((client) => {
        if (!client.followUpDate) return false;
        
        try {
          const followUpDateStr = getDateStringFromISO(client.followUpDate);
          
          // Exclude today's follow-ups - only include past dates
          if (followUpDateStr === todayStr) return false;
          
          // Only include past dates (strictly less than today)
          const followUpDate = new Date(client.followUpDate);
          followUpDate.setHours(0, 0, 0, 0);
          return followUpDate < today;
        } catch (error) {
          console.error('Error parsing follow-up date:', error);
          return false;
        }
      })
      .sort((a, b) => {
        try {
          const dateA = new Date(a.followUpDate!);
          const dateB = new Date(b.followUpDate!);
          return dateB.getTime() - dateA.getTime(); // Most recent first
        } catch (error) {
          return 0;
        }
      });
  }, [clients]);

  const getUpcomingFollowUps = useCallback((limit: number = 7) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = getLocalDateString(today);
    
    const upcoming = clients
      .filter((client) => {
        if (!client.followUpDate) return false;
        
        try {
          const followUpDateStr = getDateStringFromISO(client.followUpDate);
          
          // Exclude today's follow-ups - only include future dates
          if (followUpDateStr === todayStr) return false;
          
          // Only include future dates (strictly greater than today)
          const followUpDate = new Date(client.followUpDate);
          followUpDate.setHours(0, 0, 0, 0);
          return followUpDate > today;
        } catch (error) {
          console.error('Error parsing follow-up date:', error);
          return false;
        }
      })
      .sort((a, b) => {
        try {
          const dateA = new Date(a.followUpDate!);
          const dateB = new Date(b.followUpDate!);
          return dateA.getTime() - dateB.getTime();
        } catch (error) {
          return 0;
        }
      })
      .slice(0, limit);

    return upcoming;
  }, [clients]);

  const markFollowUpCompleted = useCallback(
    async (clientId: string, completed: boolean) => {
      try {
        const client = await storageService.getClientById(clientId);
        if (!client) {
          return false;
        }

        const updatedClient: Client = {
          ...client,
          followUpCompleted: completed,
          updatedAt: new Date().toISOString(),
        };

        await storageService.saveClient(updatedClient);
        await loadClients();
        return true;
      } catch (error) {
        console.error('Error marking follow-up as completed:', error);
        return false;
      }
    },
    [loadClients]
  );

  return {
    clients,
    loading,
    loadClients,
    saveClient,
    deleteClient,
    getTodaysFollowUps,
    getOverdueFollowUps,
    getUpcomingFollowUps,
    getClientsByFollowUpDate,
    markFollowUpCompleted,
  };
};

