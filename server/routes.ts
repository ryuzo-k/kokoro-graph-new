import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPersonSchema, insertConnectionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all people
  app.get("/api/people", async (req, res) => {
    try {
      const location = req.query.location as string;
      const people = location 
        ? await storage.getPeopleByLocation(location)
        : await storage.getAllPeople();
      res.json(people);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch people" });
    }
  });

  // Get person by ID
  app.get("/api/people/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const person = await storage.getPerson(id);
      if (!person) {
        return res.status(404).json({ error: "Person not found" });
      }
      res.json(person);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch person" });
    }
  });

  // Create person
  app.post("/api/people", async (req, res) => {
    try {
      const validatedData = insertPersonSchema.parse(req.body);
      
      // Check if person already exists
      const existing = await storage.getPersonByName(validatedData.name);
      if (existing) {
        return res.json(existing);
      }

      // Generate initials
      const initials = validatedData.name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);

      const person = await storage.createPerson({
        ...validatedData,
        initials,
      });
      res.status(201).json(person);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create person" });
      }
    }
  });

  // Search people
  app.get("/api/people/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const people = await storage.searchPeople(query);
      res.json(people);
    } catch (error) {
      res.status(500).json({ error: "Failed to search people" });
    }
  });

  // Get all connections
  app.get("/api/connections", async (req, res) => {
    try {
      const connections = await storage.getAllConnections();
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch connections" });
    }
  });

  // Get connections for a person
  app.get("/api/people/:id/connections", async (req, res) => {
    try {
      const personId = parseInt(req.params.id);
      const connections = await storage.getConnectionsForPerson(personId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch connections" });
    }
  });

  // Create connection
  app.post("/api/connections", async (req, res) => {
    try {
      const validatedData = insertConnectionSchema.parse(req.body);
      
      // Ensure both people exist
      const fromPerson = await storage.getPerson(validatedData.fromPersonId);
      const toPerson = await storage.getPerson(validatedData.toPersonId);
      
      if (!fromPerson || !toPerson) {
        return res.status(400).json({ error: "One or both people do not exist" });
      }

      const connection = await storage.createConnection(validatedData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create connection" });
      }
    }
  });

  // Get network stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getNetworkStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get locations
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  // Quick entry endpoint - combines person creation and connection
  app.post("/api/quick-entry", async (req, res) => {
    try {
      const { contactName, location, trustRating, notes } = req.body;
      
      if (!contactName || !location || !trustRating) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get or create the contact person
      let contactPerson = await storage.getPersonByName(contactName);
      if (!contactPerson) {
        const initials = contactName
          .split(' ')
          .map((part: string) => part.charAt(0))
          .join('')
          .toUpperCase()
          .substring(0, 2);

        contactPerson = await storage.createPerson({
          name: contactName,
          location,
          initials,
        });
      }

      // Get current user (ID 1)
      const currentUser = await storage.getPerson(1);
      if (!currentUser) {
        return res.status(500).json({ error: "Current user not found" });
      }

      // Create connection
      const connection = await storage.createConnection({
        fromPersonId: currentUser.id,
        toPersonId: contactPerson.id,
        trustRating: parseInt(trustRating),
        location,
        notes: notes || null,
      });

      res.status(201).json({ person: contactPerson, connection });
    } catch (error) {
      res.status(500).json({ error: "Failed to process quick entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
