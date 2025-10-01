// Fix: Add React import for React.ReactNode type.
import React from 'react';

export enum View {
  Dashboard = 'DASHBOARD',
  DataSources = 'DATA_SOURCES',
  Calculator = 'CALCULATOR',
  Optimizer = 'OPTIMIZER',
  Scenarios = 'SCENARIOS',
}

export interface KpiData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  description: string;
  icon: React.ReactNode;
}

export interface OptimizationRecommendation {
  strategy: string;
  carbon_reduction_percent: number;
  cost_change_percent: number;
  trade_offs: string;
}

export interface ScenarioForecastPoint {
  year: number;
  cost_savings: number;
  co2_reduction_tonnes: number;
}

export interface EmissionsData {
    source: string;
    emissions: number;
    color: string;
}

export interface TrendData {
    month: string;
    'CO2 Reduction (t)': number;
}

export interface CalculatorResult {
    total_emissions: number;
    breakdown: { source: string; emissions: number }[];
}