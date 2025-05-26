export const pickupStages = [
  "Request Submitted",
  "Request Being Processed",
  "Pickup Date Scheduled",
  "Driver Assigned to Pickup",
  "Driver Out for Pickup",
  "Pickup Successfully Completed",
];

export const mockScrapTypes = [
  { id: "scrap1", name: "Vegetable Peels & Scraps" },
  { id: "scrap2", name: "Fruit Waste & Leftovers" },
  { id: "scrap3", name: "Stale or Expired Bread" },
];

export const mockRequest = {
  scrapTypeId: "scrap1",
  quantityKg: 5,
  pickupDate: "2025-06-15", 
  requestId: "REQ7890",
};
