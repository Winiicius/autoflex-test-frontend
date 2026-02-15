export type Unit = "KG" | "L" | "UNIT" | "G" | "ML";

const unitMap: Record<Unit, string> = {
  KG: "Kilogram",
  L: "Liter",
  UNIT: "Unit",
  G: "Gram",
  ML: "Mililiter",
};

export function formatUnit(unit?: string): string {
  if (!unit) return "-";
  return unitMap[unit as Unit] ?? unit;
}
