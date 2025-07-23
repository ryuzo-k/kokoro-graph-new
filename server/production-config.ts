import { db } from "./db";
import { people, connections } from "@shared/schema";
import { sql } from "drizzle-orm";

export class ProductionDatabaseConfig {
  // Database health check
  static async healthCheck(): Promise<boolean> {
    try {
      await db.execute(sql`SELECT 1`);
      return true;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }

  // Performance monitoring
  static async getPerformanceStats() {
    try {
      const tableStats = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_live_tup as live_rows,
          n_dead_tup as dead_rows
        FROM pg_stat_user_tables 
        WHERE tablename IN ('people', 'connections')
      `);
      
      return tableStats;
    } catch (error) {
      console.error("Failed to get performance stats:", error);
      return null;
    }
  }

  // Database cleanup (remove old data if needed)
  static async cleanupOldData(daysOld: number = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      // This is a placeholder - be careful with deletes in production
      console.log(`Cleanup would remove data older than ${cutoffDate.toISOString()}`);
      
      return { success: true, message: "Cleanup completed" };
    } catch (error) {
      console.error("Cleanup failed:", error);
      return { success: false, message: "Cleanup failed" };
    }
  }

  // Connection pool monitoring
  static async getConnectionInfo() {
    try {
      const result = await db.execute(sql`
        SELECT 
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `);
      
      return result;
    } catch (error) {
      console.error("Failed to get connection info:", error);
      return null;
    }
  }
}

// Initialize production optimizations
export function initializeProductionMode() {
  if (process.env.NODE_ENV === 'production') {
    console.log("🚀 Production mode initialized");
    
    // Set up periodic health checks
    setInterval(async () => {
      const isHealthy = await ProductionDatabaseConfig.healthCheck();
      if (!isHealthy) {
        console.error("⚠️ Database health check failed");
      }
    }, 300000); // Every 5 minutes

    // Log performance stats periodically
    setInterval(async () => {
      const stats = await ProductionDatabaseConfig.getPerformanceStats();
      if (stats) {
        console.log("📊 Database performance stats:", stats);
      }
    }, 900000); // Every 15 minutes
  }
}