import React, { createContext, useContext, useState, type ReactNode } from "react";
import {
  type PackageType,
  type ChildrenRange,
  type WorkshopType,
  calculatePackagePrice,
  calculateWorkshopPrice,
} from "@/utils/pricing";

export type ExtraType = "recreador" | "apoio" | "hora_extra";

interface ConfiguratorState {
  packageType: PackageType | null;
  numChildren: ChildrenRange;
  selectedWorkshops: WorkshopType[];
  selectedExtras: ExtraType[];
}

interface ConfiguratorContextType extends ConfiguratorState {
  setPackageType: (type: PackageType) => void;
  setNumChildren: (num: ChildrenRange) => void;
  toggleWorkshop: (workshop: WorkshopType) => void;
  toggleExtra: (extra: ExtraType) => void;
  calculateTotal: () => number;
  getWhatsAppMessage: () => string;
}

const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(
  undefined
);

const extraPrices: Record<ExtraType, number> = {
  recreador: 180,
  apoio: 140,
  hora_extra: 200,
};

const extraLabels: Record<ExtraType, string> = {
  recreador: "Recreador adicional",
  apoio: "Apoio adicional",
  hora_extra: "Hora extra",
};

export const ConfiguratorProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ConfiguratorState>({
    packageType: null,
    numChildren: 15,
    selectedWorkshops: [],
    selectedExtras: [],
  });

  const setPackageType = (type: PackageType) => {
    setState((prev) => ({ ...prev, packageType: type }));
  };

  const setNumChildren = (num: ChildrenRange) => {
    setState((prev) => ({ ...prev, numChildren: num }));
  };

  const toggleWorkshop = (workshop: WorkshopType) => {
    setState((prev) => ({
      ...prev,
      selectedWorkshops: prev.selectedWorkshops.includes(workshop)
        ? prev.selectedWorkshops.filter((w) => w !== workshop)
        : [...prev.selectedWorkshops, workshop],
    }));
  };

  const toggleExtra = (extra: ExtraType) => {
    setState((prev) => ({
      ...prev,
      selectedExtras: prev.selectedExtras.includes(extra)
        ? prev.selectedExtras.filter((e) => e !== extra)
        : [...prev.selectedExtras, extra],
    }));
  };

  const calculateTotal = (): number => {
    if (!state.packageType) return 0;

    let total = calculatePackagePrice(state.packageType, state.numChildren);

    state.selectedWorkshops.forEach((workshop) => {
      total += calculateWorkshopPrice(workshop, state.numChildren);
    });

    state.selectedExtras.forEach((extra) => {
      total += extraPrices[extra];
    });

    return total;
  };

  const getWhatsAppMessage = (): string => {
    const baseUrl = "https://wa.me/5511965982251";

    if (!state.packageType) return baseUrl;

    const total = calculateTotal();
    const packageName = state.packageType === "classic" ? "CLASSIC" : "SELECT";

    const workshops =
      state.selectedWorkshops.length > 0
        ? state.selectedWorkshops
            .map((w) => w.replace(/_/g, " ").toUpperCase())
            .join(", ")
        : "nenhuma";

    const extras =
      state.selectedExtras.length > 0
        ? state.selectedExtras.map((e) => extraLabels[e]).join(", ")
        : "nenhum";

    const message = `Olá! Quero reservar o pacote ${packageName} para ${state.numChildren} crianças. Oficinas: ${workshops}. Extras: ${extras}. Total: R$ ${total.toLocaleString(
      "pt-BR",
      { minimumFractionDigits: 2 }
    )}.`;

    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  };

  return (
    <ConfiguratorContext.Provider
      value={{
        ...state,
        setPackageType,
        setNumChildren,
        toggleWorkshop,
        toggleExtra,
        calculateTotal,
        getWhatsAppMessage,
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error("useConfigurator must be used within ConfiguratorProvider");
  }
  return context;
};
