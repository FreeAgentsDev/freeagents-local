import type {
  CatalogIconName,
  SolutionCategory,
  SolutionId,
} from "@/lib/local-catalog/types";

/** Product SKUs are 1:1 with catalog solutions so a quote maps directly to entitlements. */
export type ProductId = SolutionId;

export type EntitlementStatus =
  | "pending"
  | "provisioning"
  | "active"
  | "paused";

/**
 * How a product gets activated for a client:
 * - `hosted_module`: runs inside this platform (e.g. clients base, dashboard).
 * - `site`: a site/app deployed per client (landing, website, store).
 * - `integration`: connects external services (WhatsApp, automations).
 * - `service`: delivered by the FreeAgents team (custom builds).
 */
export type ProvisionerKind = "hosted_module" | "site" | "integration" | "service";

export type ProductDefinition = {
  id: ProductId;
  name: string;
  category: SolutionCategory;
  icon: CatalogIconName;
  provisioner: ProvisionerKind;
  /** Short line shown in the portal product card. */
  blurb: string;
  /** Checklist created for the client when the entitlement is born. */
  onboarding: string[];
  /** Other SKUs this product works better with (informational). */
  worksWith?: ProductId[];
};

export type ProductModule = {
  product: ProductDefinition;
  /**
   * Called when an entitlement is created. Returns the initial status.
   * V1 stubs return "pending"; real provisioners (deploys, API setup)
   * plug in here without touching registration or portal code.
   */
  provision: () => Promise<EntitlementStatus>;
};
