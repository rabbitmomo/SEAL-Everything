export const userInitialPoints = 120;

export const fields = [
  { id: 1, name: "Field A" },
  { id: 2, name: "Field B" },
  { id: 3, name: "Field C" },
];

export const rewardOptions = [
  {
    id: "discount-5",
    type: "discount",
    label: "RM5 Discount on Your Next Purchase",
    cost: 50,
  },
  {
    id: "discount-10",
    type: "discount",
    label: "RM10 Discount on Your Next Purchase",
    cost: 90,
  },
  {
    id: "discount-15",
    type: "discount",
    label: "RM15 Discount on Your Next Purchase",
    cost: 130,
  },
  {
    id: "free-tomatoes-field1",
    type: "free-crop",
    fieldId: 1,
    cropName: "Tomatoes",
    label: "Get Free Tomatoes from Field A",
    cost: 100,
    availableQty: 10,
  },
  {
    id: "free-spinach-field3",
    type: "free-crop",
    fieldId: 3,
    cropName: "Spinach",
    label: "Get Free Spinach from Field C",
    cost: 80,
    availableQty: 5,
  },
];
