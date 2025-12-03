import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client } from '../types';

const STORAGE_KEY = '@fincorp_clients';

export const storageService = {
  async getAllClients(): Promise<Client[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading clients:', error);
      return [];
    }
  },

  async getClientById(id: string): Promise<Client | null> {
    try {
      const clients = await this.getAllClients();
      return clients.find((client) => client.id === id) || null;
    } catch (error) {
      console.error('Error loading client:', error);
      return null;
    }
  },

  async saveClient(client: Client): Promise<void> {
    try {
      const clients = await this.getAllClients();
      const index = clients.findIndex((c) => c.id === client.id);
      
      if (index >= 0) {
        // Update existing client - preserve createdAt, update updatedAt
        clients[index] = { 
          ...client, 
          createdAt: clients[index].createdAt, // Preserve original createdAt
          updatedAt: new Date().toISOString() 
        };
      } else {
        // New client - use provided timestamps or set new ones
        clients.push({
          ...client,
          createdAt: client.createdAt || new Date().toISOString(),
          updatedAt: client.updatedAt || new Date().toISOString(),
        });
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  },

  async deleteClient(id: string): Promise<void> {
    try {
      const clients = await this.getAllClients();
      const filtered = clients.filter((c) => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  async searchClients(query: string): Promise<Client[]> {
    try {
      const clients = await this.getAllClients();
      const lowerQuery = query.toLowerCase();
      
      return clients.filter(
        (client) =>
          client.nameOfCustomer.toLowerCase().includes(lowerQuery) ||
          client.contactNumber.includes(query) ||
          (client.nameOfCoApplicant &&
            client.nameOfCoApplicant.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching clients:', error);
      return [];
    }
  },
};

