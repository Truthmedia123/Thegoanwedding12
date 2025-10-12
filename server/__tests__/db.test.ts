import { describe, it, expect } from '@jest/globals';
import { getDb, type Env } from '../db';

describe('Database Configuration', () => {
  it('should create database instance', () => {
    // Mock D1Database
    const mockD1 = {} as any;
    const mockEnv: Env = { DB: mockD1 };
    
    const db = getDb(mockEnv);
    expect(db).toBeDefined();
  });
});

