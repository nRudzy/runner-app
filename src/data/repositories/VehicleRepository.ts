/**
 * Repository pour gérer les opérations liées aux véhicules
 */

import ApiClient from '../datasources/ApiClient';
import { Vehicle, VehiclePreferences, SearchFilter } from '../../domain/entities/Models';

interface VehicleListResponse {
  vehicles: Vehicle[];
  page: number;
  totalPages: number;
  hasMore: boolean;
}

interface VehicleImageUploadResponse {
  imageUrl: string;
}

interface VehicleSwipeResponse {
  match?: boolean;
  ownerContactInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
}

class VehicleRepository {
  // Récupérer tous les véhicules avec pagination
  async getVehicles(page: number = 1, limit: number = 10, filter?: SearchFilter): Promise<VehicleListResponse> {
    let url = `/vehicles?page=${page}&limit=${limit}`;
    
    if (filter) {
      // Ajouter les filtres à l'URL
      if (filter.makes && filter.makes.length) {
        url += `&makes=${filter.makes.join(',')}`;
      }
      if (filter.fuelTypes && filter.fuelTypes.length) {
        url += `&fuelTypes=${filter.fuelTypes.join(',')}`;
      }
      if (filter.transmissionTypes && filter.transmissionTypes.length) {
        url += `&transmissionTypes=${filter.transmissionTypes.join(',')}`;
      }
      if (filter.priceRange) {
        url += `&minPrice=${filter.priceRange[0]}&maxPrice=${filter.priceRange[1]}`;
      }
      if (filter.yearRange) {
        url += `&minYear=${filter.yearRange[0]}&maxYear=${filter.yearRange[1]}`;
      }
      if (filter.mileageRange) {
        url += `&minMileage=${filter.mileageRange[0]}&maxMileage=${filter.mileageRange[1]}`;
      }
      if (filter.distance) {
        url += `&distance=${filter.distance}`;
      }
      if (filter.onlyWithImages) {
        url += `&onlyWithImages=true`;
      }
    }
    
    const response = await ApiClient.get<VehicleListResponse>(url);
    return response.data;
  }

  // Récupérer les véhicules à swiper en fonction des préférences
  async getVehiclesToSwipe(preferences?: VehiclePreferences): Promise<Vehicle[]> {
    let url = '/vehicles/swipe';
    
    // Ajouter les préférences si elles existent
    if (preferences) {
      const params: string[] = [];
      if (preferences.brands && preferences.brands.length) {
        params.push(`brands=${preferences.brands.join(',')}`);
      }
      if (preferences.minYear) {
        params.push(`minYear=${preferences.minYear}`);
      }
      if (preferences.maxYear) {
        params.push(`maxYear=${preferences.maxYear}`);
      }
      if (preferences.minPrice) {
        params.push(`minPrice=${preferences.minPrice}`);
      }
      if (preferences.maxPrice) {
        params.push(`maxPrice=${preferences.maxPrice}`);
      }
      if (preferences.types && preferences.types.length) {
        params.push(`types=${preferences.types.join(',')}`);
      }
      if (preferences.fuelTypes && preferences.fuelTypes.length) {
        params.push(`fuelTypes=${preferences.fuelTypes.join(',')}`);
      }
      if (preferences.maxMileage) {
        params.push(`maxMileage=${preferences.maxMileage}`);
      }
      if (preferences.distance) {
        params.push(`distance=${preferences.distance}`);
      }
      
      if (params.length) {
        url += `?${params.join('&')}`;
      }
    }
    
    const response = await ApiClient.get<Vehicle[]>(url);
    return response.data;
  }

  // Récupérer un véhicule par son ID
  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await ApiClient.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  }

  // Ajouter un nouveau véhicule
  async createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'likedBy'>): Promise<Vehicle> {
    const response = await ApiClient.post<Vehicle>('/vehicles', vehicle);
    return response.data;
  }

  // Mettre à jour un véhicule
  async updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const response = await ApiClient.put<Vehicle>(`/vehicles/${id}`, vehicle);
    return response.data;
  }

  // Supprimer un véhicule
  async deleteVehicle(id: string): Promise<void> {
    await ApiClient.delete(`/vehicles/${id}`);
  }

  // Swiper un véhicule (aimer ou passer)
  async swipeVehicle(id: string, direction: 'like' | 'pass'): Promise<VehicleSwipeResponse> {
    const response = await ApiClient.post<VehicleSwipeResponse>(`/vehicles/${id}/swipe`, { direction });
    return response.data;
  }

  // Récupérer les véhicules aimés par l'utilisateur
  async getLikedVehicles(): Promise<Vehicle[]> {
    const response = await ApiClient.get<Vehicle[]>('/vehicles/liked');
    return response.data;
  }

  // Récupérer les véhicules appartenant à l'utilisateur
  async getMyVehicles(): Promise<Vehicle[]> {
    const response = await ApiClient.get<Vehicle[]>('/vehicles/my');
    return response.data;
  }

  // Récupérer les matches (véhicules dont le propriétaire a aussi aimé l'utilisateur)
  async getMatches(): Promise<Vehicle[]> {
    const response = await ApiClient.get<Vehicle[]>('/vehicles/matches');
    return response.data;
  }

  // Télécharger une image pour un véhicule
  async uploadVehicleImage(vehicleId: string, imageUri: string): Promise<string> {
    const formData = new FormData();
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    formData.append('image', {
      uri: imageUri,
      name: `vehicle_image_${Date.now()}.${fileType}`,
      type: `image/${fileType}`,
    } as any);
    
    const response = await ApiClient.uploadFile<VehicleImageUploadResponse>(`/vehicles/${vehicleId}/images`, formData);
    return response.data.imageUrl;
  }

  // Rechercher des véhicules par terme
  async searchVehicles(term: string): Promise<Vehicle[]> {
    const response = await ApiClient.get<Vehicle[]>(`/vehicles/search?q=${encodeURIComponent(term)}`);
    return response.data;
  }
}

export default new VehicleRepository(); 