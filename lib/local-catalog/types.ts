export type CatalogStep =
  | "business"
  | "goals"
  | "solutions"
  | "investment"
  | "impact";

export type SolutionCategory =
  | "presence"
  | "sales"
  | "operations"
  | "customers"
  | "automation"
  | "management"
  | "custom";

export type SolutionId =
  | "digital_profile"
  | "landing"
  | "website"
  | "catalog"
  | "store"
  | "booking"
  | "inventory"
  | "pos"
  | "clients"
  | "whatsapp"
  | "automations"
  | "dashboard"
  | "custom";

export type PackageId = "start" | "sell" | "organize" | "grow" | "custom";

export type GoalId =
  | "sell_more"
  | "save_time"
  | "organize"
  | "know_customers"
  | "digital_presence"
  | "custom";

export type BusinessTypeId =
  | "barbershop"
  | "beauty_salon"
  | "veterinary"
  | "clinic"
  | "gym"
  | "trainer"
  | "restaurant"
  | "boutique"
  | "retail_store"
  | "workshop"
  | "hotel"
  | "academy"
  | "independent"
  | "other";

export type ImpactType =
  | "revenue"
  | "time_saved"
  | "cost_saved"
  | "capacity"
  | "organization";

export type PriceDisplay = "fixed" | "from" | "range";

export type CatalogIconName =
  | "scissors"
  | "sparkles"
  | "flower"
  | "paw"
  | "stethoscope"
  | "dumbbell"
  | "trophy"
  | "utensils"
  | "shirt"
  | "shopping-bag"
  | "wrench"
  | "hotel"
  | "graduation"
  | "briefcase"
  | "store"
  | "calendar"
  | "message"
  | "users"
  | "refresh"
  | "package"
  | "dollar"
  | "cart"
  | "globe"
  | "bot"
  | "chart"
  | "heart"
  | "zap"
  | "layout"
  | "book"
  | "plug"
  | "map-pin"
  | "cpu"
  | "cloud"
  | "shield"
  | "mail"
  | "qr"
  | "clock"
  | "wallet"
  | "sliders";

export type BusinessType = {
  id: BusinessTypeId;
  name: string;
  description: string;
  icon: CatalogIconName;
  featured?: boolean;
};

export type Goal = {
  id: GoalId;
  title: string;
  description: string;
  icon: CatalogIconName;
  solutions: SolutionId[];
};

export type Solution = {
  id: SolutionId;
  name: string;
  shortDescription: string;
  category: SolutionCategory;
  icon: CatalogIconName;
  setupPrice: number;
  monthlyPrice: number;
  setupPriceMax?: number;
  monthlyPriceMax?: number;
  priceDisplay: PriceDisplay;
  recommendedFor: BusinessTypeId[];
  benefits: string[];
  features: string[];
  impacts: ImpactType[];
  popular?: boolean;
  thirdPartyNote?: string;
};

export type Package = {
  id: PackageId;
  name: string;
  message: string;
  description: string;
  icon: CatalogIconName;
  accent: "green" | "blue" | "violet" | "orange" | "red";
  fromSetup: number;
  fromMonthly: number;
  solutionIds: SolutionId[];
};

export type Recommendation = {
  solutions: SolutionId[];
};

export type ClientRangeId = "0-50" | "51-100" | "101-300" | "301-500" | "500+";

export type AdminHoursRangeId = "1-2" | "3-5" | "6-10" | "10+";

export type RangeOption<T extends string> = {
  id: T;
  label: string;
  midpoint: number;
};

export type BusinessMetrics = {
  monthlyClientsRange: ClientRangeId | null;
  averageTicket: number | null;
  weeklyAdminHoursRange: AdminHoursRangeId | null;
  hourlyValue: number | null;
};

export type QualitativeImpact = {
  type: ImpactType;
  title: string;
  description: string;
};

export type ImpactBreakdown = {
  recoverableRevenue: number | null;
  recoveredHoursPerMonth: number | null;
  timeValuePerMonth: number | null;
  extraCapacityClients: number | null;
  qualitative: QualitativeImpact[];
  hasMonetaryEstimate: boolean;
};

export type SystemComponent = {
  id: string;
  name: string;
  summary: string;
  details: string;
  includes: string[];
  icon: CatalogIconName;
  setupLabel: string;
  monthlyLabel: string;
  thirdPartyNote?: string;
};

export type CalculateSolutionInput = {
  businessType: BusinessTypeId | null;
  selectedGoals: GoalId[];
  selectedSolutions: SolutionId[];
  metrics: BusinessMetrics;
};

export type SolutionResult = {
  monthlyPrice: number;
  setupPrice: number;
  isSetupFrom: boolean;
  isMonthlyFrom: boolean;
  includedLabels: string[];
  components: SystemComponent[];
  impact: ImpactBreakdown;
  paybackMonths: number | null;
  thirdPartyNotes: string[];
};

export type CatalogLeadPayload = {
  contact: {
    name: string;
    business: string;
    whatsapp: string;
    email: string;
    city: string;
  };
  configuration: {
    businessType: BusinessTypeId | null;
    businessTypeLabel: string;
    goals: GoalId[];
    goalLabels: string[];
    solutions: SolutionId[];
    solutionLabels: string[];
    setupPrice: number;
    monthlyPrice: number;
    isSetupFrom: boolean;
    isMonthlyFrom: boolean;
  };
  calculator: BusinessMetrics;
  estimates: {
    recoverableRevenue: number | null;
    recoveredHoursPerMonth: number | null;
    timeValuePerMonth: number | null;
    extraCapacityClients: number | null;
    qualitative: string[];
    paybackMonths: number | null;
  };
  sourceCta: string;
};
