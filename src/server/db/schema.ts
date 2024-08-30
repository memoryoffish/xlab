// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * 
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `后端进阶_${name}`);

export const posts = createTable(
  "posts",
  {
    roomid: bigint("roomid", { mode: "number" }),
    creator: varchar("name", { length: 256 }).notNull(),
    content: varchar("content", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    messageid: bigint("messageid", { mode: "number" }).primaryKey().autoincrement(),
  },
    
);
export const users = createTable(
  "user",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    username: varchar("username", { length: 256 })
  }
)
export const rooms = createTable(
  "room",
  {
    id: bigint("roomid", { mode: "number" }).primaryKey().autoincrement(),
    creator: varchar("creator", { length: 256 }).notNull(),
    LastPost: varchar("content", { length: 256 }),
    roomname: varchar("roomname", { length: 256 }).notNull(),
  }
)