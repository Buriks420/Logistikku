export const APP_NAME = "LOGISTIK-KU";

export const ITEM_CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Home Goods",
  "Office Supplies",
  "Furniture",
  "Sports Equipment",
  "Toys & Games",
  "Automotive",
  "Other",
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];
