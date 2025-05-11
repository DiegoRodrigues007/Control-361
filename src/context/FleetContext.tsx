
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Vehicle, MarkerLocation, PaginationParams } from '../types/fleet';
import { vehicles as initialVehicles } from '../data/vehicles';
import { mapMarkers as initialMarkers } from '../data/mapMarkers';
// In a real implementation, you would use these imports:
// import { getVehicles } from '../api/vehicleApi';

// Auto-refresh interval in milliseconds (2 minutes)
const REFRESH_INTERVAL = 2 * 60 * 1000;

// Number of vehicles to load initially
const DEFAULT_PAGE_SIZE = 20;

interface FleetContextProps {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  mapMarkers: MarkerLocation[];
  activeTab: string;
  searchTerm: string;
  setActiveTab: (tab: string) => void;
  setSearchTerm: (term: string) => void;
  plateFilter: string;
  fleetFilter: string;
  setPlateFilter: (plate: string) => void;
  setFleetFilter: (fleet: string) => void;
  loadMoreVehicles: () => Promise<void>;
  isLoading: boolean;
  hasMoreVehicles: boolean;
  selectedVehicle: Vehicle | null;
  selectVehicle: (vehicle: Vehicle | null) => void;
}

const FleetContext = createContext<FleetContextProps>({
  vehicles: [],
  filteredVehicles: [],
  mapMarkers: [],
  activeTab: 'rastreados',
  searchTerm: '',
  plateFilter: '',
  fleetFilter: '',
  setActiveTab: () => {},
  setSearchTerm: () => {},
  setPlateFilter: () => {},
  setFleetFilter: () => {},
  loadMoreVehicles: async () => {},
  isLoading: false,
  hasMoreVehicles: false,
  selectedVehicle: null,
  selectVehicle: () => {},
});

export const useFleetContext = () => useContext(FleetContext);

interface FleetProviderProps {
  children: ReactNode;
}

export const FleetProvider: React.FC<FleetProviderProps> = ({ children }) => {
  // State for vehicles and pagination
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [mapMarkers] = useState<MarkerLocation[]>(initialMarkers);
  const [activeTab, setActiveTab] = useState<string>('rastreados');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [plateFilter, setPlateFilter] = useState<string>('');
  const [fleetFilter, setFleetFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMoreVehicles, setHasMoreVehicles] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Function to fetch vehicles - in a real implementation, this would call the API
  const fetchVehicles = useCallback(async (page: number, reset: boolean = false) => {
    setIsLoading(true);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, this would be:
      // const response = await getVehicles({
      //   page,
      //   limit: DEFAULT_PAGE_SIZE,
      //   plateFilter,
      //   fleetFilter
      // });
      
      // For now, we'll mock the response with our initial data
      const mockTotalVehicles = initialVehicles.length;
      const startIndex = (page - 1) * DEFAULT_PAGE_SIZE;
      const endIndex = startIndex + DEFAULT_PAGE_SIZE;
      const pageData = initialVehicles.slice(startIndex, endIndex);
      
      // Update vehicles list - append or replace based on reset flag
      setVehicles(prev => (reset ? pageData : [...prev, ...pageData]));
      setHasMoreVehicles(endIndex < mockTotalVehicles);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [plateFilter, fleetFilter]);

  // Function to load more vehicles
  const loadMoreVehicles = useCallback(async () => {
    if (!isLoading && hasMoreVehicles) {
      await fetchVehicles(currentPage + 1, false);
    }
  }, [fetchVehicles, currentPage, isLoading, hasMoreVehicles]);

  // Function to select a vehicle
  const selectVehicle = (vehicle: Vehicle | null) => {
    setSelectedVehicle(vehicle);
  };

  // Initial fetch
  useEffect(() => {
    fetchVehicles(1, true);
  }, [fetchVehicles, plateFilter, fleetFilter]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing vehicle data...');
      fetchVehicles(1, true);
    }, REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [fetchVehicles]);

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle => {
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.plate.toLowerCase().includes(searchLower) ||
      vehicle.fleet.toLowerCase().includes(searchLower) ||
      vehicle.model.toLowerCase().includes(searchLower) ||
      vehicle.type.toLowerCase().includes(searchLower) ||
      vehicle.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <FleetContext.Provider 
      value={{
        vehicles,
        filteredVehicles,
        mapMarkers,
        activeTab,
        searchTerm,
        plateFilter,
        fleetFilter,
        setActiveTab,
        setSearchTerm,
        setPlateFilter,
        setFleetFilter,
        loadMoreVehicles,
        isLoading,
        hasMoreVehicles,
        selectedVehicle,
        selectVehicle
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};
