import React, { useState } from 'react';
import { View } from './types';
import Dashboard from './components/Dashboard';
import { DataSourceManager, CarbonFootprintCalculator, OptimizationEngine, WhatIfScenario } from './components/FeaturePanels';
import { DashboardIcon, DataSourcesIcon, CalculatorIcon, OptimizerIcon, ScenariosIcon, LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);

  const renderView = () => {
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard />;
      case View.DataSources:
        return <DataSourceManager />;
      case View.Calculator:
        return <CarbonFootprintCalculator />;
      case View.Optimizer:
        return <OptimizationEngine />;
      case View.Scenarios:
        return <WhatIfScenario />;
      default:
        return <Dashboard />;
    }
  };

  const NavItem: React.FC<{
    view: View;
    icon: React.ReactNode;
    label: string;
  }> = ({ view, icon, label }) => (
    <li>
      <button
        onClick={() => setActiveView(view)}
        className={`flex items-center w-full p-3 rounded-lg text-left transition-all duration-200 ${
          activeView === view
            ? 'bg-primary text-white shadow-md'
            : 'text-gray-600 hover:bg-emerald-100 hover:text-gray-800'
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span className="font-medium">{label}</span>
      </button>
    </li>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-20 flex items-center justify-center px-4 border-b">
          <div className="flex items-center text-primary">
            <LogoIcon className="h-8 w-8 mr-2"/>
            <h1 className="text-xl font-bold tracking-tight text-gray-800">
              GreenOps
            </h1>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <NavItem view={View.Dashboard} icon={<DashboardIcon />} label="Dashboard" />
            <NavItem view={View.DataSources} icon={<DataSourcesIcon />} label="Data Sources" />
            <NavItem view={View.Calculator} icon={<CalculatorIcon />} label="Calculator" />
            <NavItem view={View.Optimizer} icon={<OptimizerIcon />} label="Optimizer" />
            <NavItem view={View.Scenarios} icon={<ScenariosIcon />} label="What-If Scenarios" />
          </ul>
        </nav>
        <div className="p-4 border-t">
            <div className="text-center text-xs text-gray-500">
                &copy; 2024 GreenOps Optimizer
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
