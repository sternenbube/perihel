import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const sqlite = openDatabaseSync("perihel.db"); // opens or creates the file
sqlite.execSync("PRAGMA foreign_keys = ON"); // Activate Foreign Keys every time it is opened
export const db = drizzle(sqlite);
