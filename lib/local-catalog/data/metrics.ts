import type {
  AdminHoursRangeId,
  ClientRangeId,
  RangeOption,
} from "@/lib/local-catalog/types";

export const CLIENT_RANGES: RangeOption<ClientRangeId>[] = [
  { id: "0-50", label: "0–50", midpoint: 25 },
  { id: "51-100", label: "51–100", midpoint: 75 },
  { id: "101-300", label: "101–300", midpoint: 200 },
  { id: "301-500", label: "301–500", midpoint: 400 },
  { id: "500+", label: "500+", midpoint: 600 },
];

export const ADMIN_HOUR_RANGES: RangeOption<AdminHoursRangeId>[] = [
  { id: "1-2", label: "1–2 h", midpoint: 1.5 },
  { id: "3-5", label: "3–5 h", midpoint: 4 },
  { id: "6-10", label: "6–10 h", midpoint: 8 },
  { id: "10+", label: "10+ h", midpoint: 12 },
];

export const EMPTY_METRICS = {
  monthlyClientsRange: null,
  averageTicket: null,
  weeklyAdminHoursRange: null,
  hourlyValue: null,
} as const;
