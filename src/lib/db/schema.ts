import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

// 1. Healthcheck table for verifying connection and schema sync
export const systemHealth = pgTable("system_health", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: text("status").notNull().default("OK"),
  note: text("note"),
  lastCheckedAt: timestamp("last_checked_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 2. Company / Organization (HR Branding)
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#2563eb"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 3. Assessment definitions
export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(), // e.g. 'WHO5_BASELINE'
  title: text("title").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 4. Instruments (e.g. WHO-5 2024 Version)
export const instruments = pgTable("instruments", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentId: uuid("assessment_id")
    .references(() => assessments.id)
    .notNull(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  version: text("version").default("1.0").notNull(),
  scoringStrategy: text("scoring_strategy").notNull().default("WHO5"), // Strategy pattern key
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 5. Instrument Items (Questions)
export const instrumentItems = pgTable("instrument_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  instrumentId: uuid("instrument_id")
    .references(() => instruments.id)
    .notNull(),
  orderIndex: integer("order_index").notNull(),
  itemCode: text("item_code").notNull(), // e.g. 'WHO5_Q1'
  questionText: text("question_text").notNull(),
  isRequired: boolean("is_required").default(true).notNull(),
});

// 6. Instrument Options (0 - 5 scale)
export const instrumentOptions = pgTable("instrument_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  instrumentId: uuid("instrument_id")
    .references(() => instruments.id)
    .notNull(),
  label: text("label").notNull(), // e.g. 'All of the time'
  scoreValue: integer("score_value").notNull(), // 0 to 5
  orderIndex: integer("order_index").notNull(),
});

// 7. Assessment Sessions (Created by HR with a public link token)
export const assessmentSessions = pgTable("assessment_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .references(() => companies.id)
    .notNull(),
  instrumentId: uuid("instrument_id")
    .references(() => instruments.id)
    .notNull(),
  publicTokenHash: text("public_token_hash").notNull().unique(),
  appliedPosition: text("applied_position").notNull(),
  durationMinutes: integer("duration_minutes").default(15).notNull(),
  allowRetake: boolean("allow_retake").default(false).notNull(),
  status: text("status").default("ACTIVE").notNull(), // ACTIVE, CLOSED, EXPIRED
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 8. Candidates (Submitted data)
export const candidates = pgTable("candidates", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  appliedPosition: text("applied_position").notNull(),
  platform: text("platform").notNull(), // e.g. 'Glints', 'LinkedIn'
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 9. Candidate Attempts
export const attempts = pgTable("attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => assessmentSessions.id)
    .notNull(),
  candidateId: uuid("candidate_id")
    .references(() => candidates.id)
    .notNull(),
  attemptTokenHash: text("attempt_token_hash").notNull().unique(),
  status: text("status").default("IN_PROGRESS").notNull(), // IN_PROGRESS, COMPLETED, EXPIRED, ABANDONED
  startedAt: timestamp("started_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  clientMeta: jsonb("client_meta"),
});

// 10. Attempt Answers
export const attemptAnswers = pgTable("attempt_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  attemptId: uuid("attempt_id")
    .references(() => attempts.id)
    .notNull(),
  itemId: uuid("item_id")
    .references(() => instrumentItems.id)
    .notNull(),
  selectedOptionId: uuid("selected_option_id")
    .references(() => instrumentOptions.id)
    .notNull(),
  scoreValue: integer("score_value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 11. Assessment Results (Calculated by Scoring Strategy)
export const assessmentResults = pgTable("assessment_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  attemptId: uuid("attempt_id")
    .references(() => attempts.id)
    .notNull()
    .unique(),
  rawScore: integer("raw_score").notNull(),
  percentageScore: integer("percentage_score").notNull(),
  scoreBand: text("score_band").notNull(), // 'GOOD', 'LOW_WELLBEING', 'DEPRESSION_RISK'
  interpretationSummary: text("interpretation_summary").notNull(),
  hasItemScoreUnderTwo: boolean("has_item_score_under_two").default(false),
  isValid: boolean("is_valid").default(true).notNull(),
  calculatedAt: timestamp("calculated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
