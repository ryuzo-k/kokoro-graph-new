import { people, connections, type Person, type InsertPerson, type Connection, type InsertConnection, type NetworkStats } from "@shared/schema";

export interface IStorage {
  // Person operations
  getPerson(id: number): Promise<Person | undefined>;
  getPersonByName(name: string): Promise<Person | undefined>;
  createPerson(person: InsertPerson): Promise<Person>;
  getAllPeople(): Promise<Person[]>;
  getPeopleByLocation(location: string): Promise<Person[]>;
  updatePersonStats(id: number, averageRating: number, connectionCount: number): Promise<void>;

  // Connection operations
  getConnection(id: number): Promise<Connection | undefined>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnectionsForPerson(personId: number): Promise<Connection[]>;
  getAllConnections(): Promise<Connection[]>;
  getConnectionsBetween(person1Id: number, person2Id: number): Promise<Connection[]>;
  updateMeetingCount(fromPersonId: number, toPersonId: number): Promise<void>;

  // Analytics
  getNetworkStats(): Promise<NetworkStats>;
  getLocations(): Promise<string[]>;
  searchPeople(query: string): Promise<Person[]>;
}

export class MemStorage implements IStorage {
  private people: Map<number, Person>;
  private connections: Map<number, Connection>;
  private currentPersonId: number;
  private currentConnectionId: number;

  constructor() {
    this.people = new Map();
    this.connections = new Map();
    this.currentPersonId = 1;
    this.currentConnectionId = 1;

    // Initialize with current user
    this.createPerson({
      name: "自分",
      location: "Tokyo",
      initials: "自分"
    });
  }

  // Person operations
  async getPerson(id: number): Promise<Person | undefined> {
    return this.people.get(id);
  }

  async getPersonByName(name: string): Promise<Person | undefined> {
    return Array.from(this.people.values()).find(
      (person) => person.name === name
    );
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const id = this.currentPersonId++;
    const person: Person = {
      ...insertPerson,
      id,
      averageRating: 0,
      connectionCount: 0,
      createdAt: new Date(),
    };
    this.people.set(id, person);
    return person;
  }

  async getAllPeople(): Promise<Person[]> {
    return Array.from(this.people.values());
  }

  async getPeopleByLocation(location: string): Promise<Person[]> {
    return Array.from(this.people.values()).filter(
      (person) => person.location === location
    );
  }

  async updatePersonStats(id: number, averageRating: number, connectionCount: number): Promise<void> {
    const person = this.people.get(id);
    if (person) {
      this.people.set(id, {
        ...person,
        averageRating,
        connectionCount,
      });
    }
  }

  // Connection operations
  async getConnection(id: number): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    // Check if connection already exists
    const existing = await this.getConnectionsBetween(
      insertConnection.fromPersonId,
      insertConnection.toPersonId
    );

    if (existing.length > 0) {
      // Update existing connection
      const existingConnection = existing[0];
      const updatedConnection: Connection = {
        ...existingConnection,
        trustRating: insertConnection.trustRating,
        location: insertConnection.location,
        notes: insertConnection.notes || null,
        meetingCount: (existingConnection.meetingCount || 0) + 1,
        lastMeeting: new Date(),
      };
      this.connections.set(existingConnection.id, updatedConnection);
      
      // Update stats
      await this.recalculatePersonStats(insertConnection.fromPersonId);
      await this.recalculatePersonStats(insertConnection.toPersonId);
      
      return updatedConnection;
    }

    const id = this.currentConnectionId++;
    const connection: Connection = {
      ...insertConnection,
      id,
      notes: insertConnection.notes || null,
      meetingCount: 1,
      lastMeeting: new Date(),
      createdAt: new Date(),
    };
    this.connections.set(id, connection);

    // Update person stats
    await this.recalculatePersonStats(insertConnection.fromPersonId);
    await this.recalculatePersonStats(insertConnection.toPersonId);

    return connection;
  }

  async getConnectionsForPerson(personId: number): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter(
      (connection) =>
        connection.fromPersonId === personId || connection.toPersonId === personId
    );
  }

  async getAllConnections(): Promise<Connection[]> {
    return Array.from(this.connections.values());
  }

  async getConnectionsBetween(person1Id: number, person2Id: number): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter(
      (connection) =>
        (connection.fromPersonId === person1Id && connection.toPersonId === person2Id) ||
        (connection.fromPersonId === person2Id && connection.toPersonId === person1Id)
    );
  }

  async updateMeetingCount(fromPersonId: number, toPersonId: number): Promise<void> {
    const connections = await this.getConnectionsBetween(fromPersonId, toPersonId);
    if (connections.length > 0) {
      const connection = connections[0];
      this.connections.set(connection.id, {
        ...connection,
        meetingCount: (connection.meetingCount || 0) + 1,
        lastMeeting: new Date(),
      });
    }
  }

  // Analytics
  async getNetworkStats(): Promise<NetworkStats> {
    const allPeople = await this.getAllPeople();
    const allConnections = await this.getAllConnections();
    
    const totalPeople = allPeople.length;
    const totalConnections = allConnections.length;
    
    const averageTrust = allConnections.length > 0 
      ? allConnections.reduce((sum, conn) => sum + conn.trustRating, 0) / allConnections.length
      : 0;
    
    const locations = new Set(allPeople.map(p => p.location));
    const activeCommunities = locations.size;
    
    const trustDistribution = averageTrust / 5 * 100; // Convert to percentage
    
    return {
      totalPeople,
      totalConnections,
      averageTrust: Math.round(averageTrust * 10) / 10,
      activeCommunities,
      trustDistribution,
    };
  }

  async getLocations(): Promise<string[]> {
    const allPeople = await this.getAllPeople();
    const locations = new Set(allPeople.map(p => p.location));
    return Array.from(locations);
  }

  async searchPeople(query: string): Promise<Person[]> {
    const allPeople = await this.getAllPeople();
    const lowercaseQuery = query.toLowerCase();
    return allPeople.filter(person =>
      person.name.toLowerCase().includes(lowercaseQuery) ||
      person.location.toLowerCase().includes(lowercaseQuery)
    );
  }

  private async recalculatePersonStats(personId: number): Promise<void> {
    const connections = await this.getConnectionsForPerson(personId);
    const connectionCount = connections.length;
    
    const averageRating = connections.length > 0
      ? connections.reduce((sum, conn) => sum + conn.trustRating, 0) / connections.length
      : 0;
    
    await this.updatePersonStats(personId, averageRating, connectionCount);
  }
}

export const storage = new MemStorage();
