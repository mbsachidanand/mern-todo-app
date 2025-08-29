import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  timeAgo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoInput {
  title: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TodoUpdate {
  title?: string;
  done?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface ApiError {
  error: string;
  details?: string[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
