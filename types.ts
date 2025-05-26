// types.ts
import { NextRequest } from 'next/server';

export interface RouteContext {
  params: Promise<{ [key: string]: string }>;
}