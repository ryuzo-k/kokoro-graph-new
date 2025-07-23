import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  initials: text("initials").notNull(),
  averageRating: real("average_rating").default(0),
  connectionCount: integer("connection_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  fromPersonId: integer("from_person_id").notNull(),
  toPersonId: integer("to_person_id").notNull(),
  trustRating: integer("trust_rating").notNull(),
  location: text("location").notNull(),
  notes: text("notes"),
  meetingCount: integer("meeting_count").default(1),
  lastMeeting: timestamp("last_meeting").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPersonSchema = createInsertSchema(people).omit({
  id: true,
  averageRating: true,
  connectionCount: true,
  createdAt: true,
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  meetingCount: true,
  lastMeeting: true,
  createdAt: true,
});

export type InsertPerson = z.infer<typeof insertPersonSchema>;
export type Person = typeof people.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Connection = typeof connections.$inferSelect;

// Additional types for graph visualization
export type GraphNode = {
  key: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  person: Person;
};

export type GraphEdge = {
  key: string;
  source: string;
  target: string;
  size: number;
  color: string;
  connection: Connection;
};

export type NetworkStats = {
  totalPeople: number;
  totalConnections: number;
  averageTrust: number;
  activeCommunities: number;
  trustDistribution: number;
};
