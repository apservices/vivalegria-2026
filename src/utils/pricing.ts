// Dynamic Pricing Calculator for Vivalegria
// Based on "Tabela de PreÃƒÂ§os 2025 Ã¢â‚¬â€œ Vivalegria Festas"
export type ChildrenRange = 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50;
export type PackageType = "select" | "classic";
export type WorkshopType = 
  | "pintura_basica" 
  | "pintura_pro" 
  | "slime" 
  | "micangas" 
  | "jardinagem" 
  | "tela" 
  | "cupcake" 
  | "baladinha" 
  | "magicas"
  | "baby"
  | "torta"
  | "oficinas_criativas";
// Package Base Prices (Updated 2025)
const packagePrices: Record<PackageType, Record<ChildrenRange, number>> = {
  classic: {
    15: 589.90,
    20: 764.90,
    25: 914.90,
    30: 1064.90,
    35: 1189.90,
    40: 1314.90,
    45: 1439.90,
    50: 1564.90,
  },
  select: {
    15: 789.90,
    20: 969.90,
    25: 1119.90,
    30: 1269.90,
    35: 1389.90,
    40: 1519.90,
    45: 1639.90,
    50: 1769.90,
  },
};
// Workshop/Service Prices (Updated 2025)
const workshopPrices: Record<WorkshopType, Record<ChildrenRange, number>> = {
  pintura_pro: { 15: 249.90, 20: 274.90, 25: 299.90, 30: 324.90, 35: 349.90, 40: 374.90, 45: 399.90, 50: 425.00 },
  pintura_basica: { 15: 149.90, 20: 174.00, 25: 199.00, 30: 224.00, 35: 249.00, 40: 274.00, 45: 299.00, 50: 325.00 },
  tela: { 15: 330.00, 20: 430.00, 25: 516.00, 30: 601.00, 35: 676.00, 40: 751.00, 45: 826.00, 50: 901.00 },
  cupcake: { 15: 330.00, 20: 430.00, 25: 516.00, 30: 601.00, 35: 676.00, 40: 751.00, 45: 826.00, 50: 901.00 },
  slime: { 15: 250.00, 20: 325.00, 25: 398.00, 30: 463.00, 35: 526.00, 40: 581.00, 45: 635.00, 50: 685.00 },
  micangas: { 15: 250.00, 20: 325.00, 25: 398.00, 30: 463.00, 35: 526.00, 40: 581.00, 45: 635.00, 50: 685.00 },
  jardinagem: { 15: 250.00, 20: 325.00, 25: 398.00, 30: 463.00, 35: 526.00, 40: 581.00, 45: 635.00, 50: 685.00 },
  oficinas_criativas: { 15: 250.00, 20: 325.00, 25: 398.00, 30: 463.00, 35: 526.00, 40: 581.00, 45: 635.00, 50: 685.00 },
  baladinha: { 15: 989, 20: 1099, 25: 1199, 30: 1299, 35: 1349, 40: 1399, 45: 1449, 50: 1499 },
  magicas: { 15: 900, 20: 950, 25: 1000, 30: 1050, 35: 1075, 40: 1100, 45: 1125, 50: 1150 },
  baby: { 15: 300, 20: 340, 25: 360, 30: 380, 35: 400, 40: 420, 45: 440, 50: 460 },
  torta: { 15: 180, 20: 200, 25: 210, 30: 220, 35: 230, 40: 240, 45: 250, 50: 260 },
};
export const calculatePackagePrice = (
  packageType: PackageType,
  numChildren: ChildrenRange
): number => {
  return packagePrices[packageType][numChildren];
};
export const calculateWorkshopPrice = (
  workshopType: WorkshopType,
  numChildren: ChildrenRange
): number => {
  return workshopPrices[workshopType][numChildren];
};
export const getMinimumPrice = (type: "package" | "workshop", name: string): number => {
  if (type === "package") {
    return packagePrices[name as PackageType][15];
  }
  return workshopPrices[name as WorkshopType][15];
};
export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
export const childrenRanges: { label: string; value: ChildrenRange }[] = [
  { label: "AtÃƒÂ© 15 crianÃƒÂ§as", value: 15 },
  { label: "16-20 crianÃƒÂ§as", value: 20 },
  { label: "21-25 crianÃƒÂ§as", value: 25 },
  { label: "26-30 crianÃƒÂ§as", value: 30 },
  { label: "31-35 crianÃƒÂ§as", value: 35 },
  { label: "36-40 crianÃƒÂ§as", value: 40 },
  { label: "41-45 crianÃƒÂ§as", value: 45 },
  { label: "46-50 crianÃƒÂ§as", value: 50 }];
// Price table data for display
export const priceTableData = [
  { children: 15, pinturaPro: 249.90, pinturaBasica: 149.90, oficinaTela: 330.00, oficinasCriativas: 250.00, classic: 589.90, select: 789.90 },
  { children: 20, pinturaPro: 274.90, pinturaBasica: 174.00, oficinaTela: 430.00, oficinasCriativas: 325.00, classic: 764.90, select: 969.90 },
  { children: 25, pinturaPro: 299.90, pinturaBasica: 199.00, oficinaTela: 516.00, oficinasCriativas: 398.00, classic: 914.90, select: 1119.90 },
  { children: 30, pinturaPro: 324.90, pinturaBasica: 224.00, oficinaTela: 601.00, oficinasCriativas: 463.00, classic: 1064.90, select: 1269.90 },
  { children: 35, pinturaPro: 349.90, pinturaBasica: 249.00, oficinaTela: 676.00, oficinasCriativas: 526.00, classic: 1189.90, select: 1389.90 },
  { children: 40, pinturaPro: 374.90, pinturaBasica: 274.00, oficinaTela: 751.00, oficinasCriativas: 581.00, classic: 1314.90, select: 1519.90 },
  { children: 45, pinturaPro: 399.90, pinturaBasica: 299.00, oficinaTela: 826.00, oficinasCriativas: 635.00, classic: 1439.90, select: 1639.90 },
  { children: 50, pinturaPro: 425.00, pinturaBasica: 325.00, oficinaTela: 901.00, oficinasCriativas: 685.00, classic: 1564.90, select: 1769.90 }];
