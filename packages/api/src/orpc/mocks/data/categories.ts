import type { Category } from "../../schemas/category.schema";

/**
 * Top-level momo-style categories. Kept intentionally shallow (one nested
 * level) — enough to demonstrate the tree shape without bloating mock data.
 */
export const categories: Category[] = [
  {
    id: "3c",
    name: "手機/3C",
    level: 1,
    parentId: null,
    children: [
      {
        id: "3c-phone",
        name: "手機通訊",
        level: 2,
        parentId: "3c",
        children: [],
      },
      {
        id: "3c-laptop",
        name: "筆電/平板",
        level: 2,
        parentId: "3c",
        children: [],
      },
    ],
  },
  {
    id: "appliance",
    name: "家電",
    level: 1,
    parentId: null,
    children: [
      {
        id: "appliance-large",
        name: "大型家電",
        level: 2,
        parentId: "appliance",
        children: [],
      },
      {
        id: "appliance-kitchen",
        name: "廚房家電",
        level: 2,
        parentId: "appliance",
        children: [],
      },
    ],
  },
  { id: "beauty", name: "美妝保養", level: 1, parentId: null, children: [] },
  { id: "baby", name: "母嬰用品", level: 1, parentId: null, children: [] },
  { id: "food", name: "食品/飲料", level: 1, parentId: null, children: [] },
  { id: "fashion", name: "服飾/運動", level: 1, parentId: null, children: [] },
  { id: "home", name: "居家日用", level: 1, parentId: null, children: [] },
];

/** Flat lookup of the top-level categories, preserving display order. */
export const topCategories = categories.map((c) => ({
  id: c.id,
  name: c.name,
}));
