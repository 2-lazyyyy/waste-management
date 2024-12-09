

import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";

import * as schema from './schema' 

const sql = neon('postgresql://neondb_owner:WN93UVmoJtKQ@ep-divine-voice-a1w4bksp.ap-southeast-1.aws.neon.tech/WasteManagementSystem?sslmode=require')

export const db = drizzle(sql , {schema}) 