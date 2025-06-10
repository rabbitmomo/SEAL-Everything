
export const cropsByField = {
  1: [{ id: 1, name: "Cabbage", price: 8.6 }],
  2: [{ id: 2, name: "Carrots", price: 12.2 }],
  3: [{ id: 3, name: "Tomatoes", price: 25.5 }],
};

export const mockFieldStatus = {
  1: {
    crops: [{ id: 1, name: "Cabbage", growthStage: "Growing" }],
    estimatedHarvestDate: new Date("2025-06-06"),
    lastUpdated: new Date(),
    weather: {
      temperature: 30,
      condition: "Sunny",
      humidity: 45,
      windSpeed: 12,
    },
    soilMoisture: "Optimal (45%)",
    lastFertilized: new Date("2025-05-15"),
    irrigationStatus: "Active",
    notes: "Everything looks good so far—no pests spotted, and the irrigation system is running smoothly.",
  },

  2: {
    crops: [{ id: 2, name: "Carrots", growthStage: "Harvest Ready" }],
    estimatedHarvestDate: new Date("2025-05-22"), 
    lastUpdated: new Date(),
    weather: {
      temperature: 28,
      condition: "Cloudy",
      humidity: 55,
      windSpeed: 8,
    },
    soilMoisture: "Low (30%) — might need irrigation soon",
    lastFertilized: new Date("2025-05-10"),
    irrigationStatus: "Scheduled",
    notes: "Looks like heavy rain’s coming next week, so we're prepping the soil just in time.",
  },

  3: {
    crops: [{ id: 3, name: "Tomatoes", growthStage: "Growing" }],
    estimatedHarvestDate: new Date("2025-06-01"),
    lastUpdated: new Date(),
    weather: {
      temperature: 29,
      condition: "Partly Cloudy",
      humidity: 50,
      windSpeed: 10,
    },
    soilMoisture: "Good (40%)",
    lastFertilized: new Date("2025-05-12"),
    irrigationStatus: "Active",
    notes: "Added some organic fertilizer a couple of days ago, so the plants should be happy.",
  },
};
