export interface TrackedCrop {
  id: string;
  name: string;
  startDate: string;
  estimatedHarvestDate: string;
  currentPhase: 'preparation' | 'sowing' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest';
  daysRemaining: number;
  progress: number;
  category: string;
  expectedYield: string;
  marketPrice: string;
  emoji: string;
  status: 'active' | 'completed' | 'paused';
  profitProjection: string;
  trackingStartDate: string;
}

class CropTrackingService {
  private storageKey = 'trackedCrops';

  // Get all tracked crops
  getTrackedCrops(): TrackedCrop[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting tracked crops:', error);
      return [];
    }
  }

  // Add a new crop to tracking
  addCropToTracking(crop: Omit<TrackedCrop, 'trackingStartDate'>): boolean {
    try {
      const trackedCrops = this.getTrackedCrops();
      
      // Check if crop is already being tracked
      const existingCrop = trackedCrops.find(tc => tc.id === crop.id || tc.name.toLowerCase() === crop.name.toLowerCase());
      if (existingCrop) {
        return false; // Already tracking this crop
      }

      const newTrackedCrop: TrackedCrop = {
        ...crop,
        trackingStartDate: new Date().toISOString()
      };

      trackedCrops.push(newTrackedCrop);
      localStorage.setItem(this.storageKey, JSON.stringify(trackedCrops));
      
      return true;
    } catch (error) {
      console.error('Error adding crop to tracking:', error);
      return false;
    }
  }

  // Remove a crop from tracking
  removeCropFromTracking(cropId: string): boolean {
    try {
      const trackedCrops = this.getTrackedCrops();
      const filteredCrops = trackedCrops.filter(crop => crop.id !== cropId);
      
      if (filteredCrops.length !== trackedCrops.length) {
        localStorage.setItem(this.storageKey, JSON.stringify(filteredCrops));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error removing crop from tracking:', error);
      return false;
    }
  }

  // Check if a crop is being tracked
  isCropTracked(cropName: string): boolean {
    const trackedCrops = this.getTrackedCrops();
    return trackedCrops.some(crop => 
      crop.name.toLowerCase() === cropName.toLowerCase() && 
      crop.status === 'active'
    );
  }

  // Get tracked crop names (for filtering recommendations)
  getTrackedCropNames(): string[] {
    return this.getTrackedCrops()
      .filter(crop => crop.status === 'active')
      .map(crop => crop.name.toLowerCase());
  }

  // Update crop progress and phase
  updateCropProgress(cropId: string, updates: Partial<TrackedCrop>): boolean {
    try {
      const trackedCrops = this.getTrackedCrops();
      const cropIndex = trackedCrops.findIndex(crop => crop.id === cropId);
      
      if (cropIndex !== -1) {
        trackedCrops[cropIndex] = { ...trackedCrops[cropIndex], ...updates };
        localStorage.setItem(this.storageKey, JSON.stringify(trackedCrops));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating crop progress:', error);
      return false;
    }
  }

  // Get active crops (currently being grown)
  getActiveCrops(): TrackedCrop[] {
    return this.getTrackedCrops().filter(crop => crop.status === 'active');
  }

  // Calculate days remaining for harvest
  calculateDaysRemaining(harvestDate: string): number {
    const harvest = new Date(harvestDate);
    const today = new Date();
    const timeDiff = harvest.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  // Calculate crop progress percentage
  calculateProgress(startDate: string, harvestDate: string): number {
    const start = new Date(startDate);
    const harvest = new Date(harvestDate);
    const today = new Date();
    
    const totalDuration = harvest.getTime() - start.getTime();
    const elapsed = today.getTime() - start.getTime();
    
    const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    return Math.round(progress);
  }

  // Get current crop phase based on progress
  getCurrentPhase(progress: number): TrackedCrop['currentPhase'] {
    if (progress < 15) return 'preparation';
    if (progress < 25) return 'sowing';
    if (progress < 50) return 'vegetative';
    if (progress < 75) return 'flowering';
    if (progress < 95) return 'fruiting';
    return 'harvest';
  }

  // Clear all tracking data (for testing)
  clearAllTrackedCrops(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const cropTrackingService = new CropTrackingService();