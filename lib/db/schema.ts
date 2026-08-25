import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*  Better Auth (email + password, sessions in Postgres)                       */
/* -------------------------------------------------------------------------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    issuer: text("issuer").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

/* -------------------------------------------------------------------------- */
/*  Clients: organizations, memberships                                        */
/* -------------------------------------------------------------------------- */

export const memberRoleEnum = pgEnum("member_role", ["owner", "staff"]);

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  businessType: text("business_type"),
  city: text("city"),
  whatsapp: text("whatsapp"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").notNull().default("owner"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("organization_members_org_user_idx").on(
      table.organizationId,
      table.userId,
    ),
  ],
);

/* -------------------------------------------------------------------------- */
/*  Catalog: quotes (package snapshots) and leads                              */
/* -------------------------------------------------------------------------- */

export const catalogQuotes = pgTable("catalog_quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  /** Full configuration snapshot from the catalog (goals, solutions, metrics, estimates). */
  snapshot: jsonb("snapshot").notNull(),
  setupPrice: integer("setup_price").notNull().default(0),
  monthlyPrice: integer("monthly_price").notNull().default(0),
  isSetupFrom: boolean("is_setup_from").notNull().default(false),
  isMonthlyFrom: boolean("is_monthly_from").notNull().default(false),
  sourceCta: text("source_cta").notNull().default("register"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const catalogLeads = pgTable("catalog_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  business: text("business").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  city: text("city").notNull(),
  sourceCta: text("source_cta").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  Products: entitlements + onboarding (plug-and-play activation)             */
/* -------------------------------------------------------------------------- */

export const entitlementStatusEnum = pgEnum("entitlement_status", [
  "pending",
  "provisioning",
  "active",
  "paused",
]);

export const entitlements = pgTable(
  "entitlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    /** Product SKU. Matches `SolutionId` in the catalog and `lib/products` registry. */
    productId: text("product_id").notNull(),
    status: entitlementStatusEnum("status").notNull().default("pending"),
    quoteId: uuid("quote_id").references(() => catalogQuotes.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("entitlements_org_product_idx").on(
      table.organizationId,
      table.productId,
    ),
  ],
);

export const onboardingItems = pgTable("onboarding_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  entitlementId: uuid("entitlement_id")
    .notNull()
    .references(() => entitlements.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  done: boolean("done").notNull().default(false),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Organization = typeof organizations.$inferSelect;
export type Entitlement = typeof entitlements.$inferSelect;
export type CatalogQuote = typeof catalogQuotes.$inferSelect;
export type OnboardingItem = typeof onboardingItems.$inferSelect;
