import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { KpiData, EmissionsData, TrendData } from '../types';
import { SavingsIcon, CarbonIcon, RenewablesIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';

const kpiData: KpiData[] = [
  {
    title: 'Cost Savings',
    value: '$1.2M',
    change: '+12.5%',
    changeType: 'increase',
    description: 'since last quarter',
    icon: <SavingsIcon />,
  },
  {
    title: 'Carbon Reduction',
    value: '850 tCO₂e',
    change: '-8.2%',
    changeType: 'decrease',
    description: 'since last quarter',
    icon: <CarbonIcon />,
  },
  {
    title: 'Renewable Energy',
    value: '45%',
    change: '+5%',
    changeType: 'increase',
    description: 'of total consumption',
    icon: <RenewablesIcon />,
  },
];

const emissionsData: EmissionsData[] = [
  { source: 'Energy', emissions: 400, color: '#0ea5e9' }, // sky-500
  { source: 'Logistics', emissions: 300, color: '#10b981' }, // emerald-500
  { source: 'Supply Chain', emissions: 220, color: '#f97316' }, // orange-500
  { source: 'Waste', emissions: 150, color: '#6b7280' }, // gray-500
  { source: 'Business Travel', emissions: 80, color: '#8b5cf6' }, // violet-500
];

const trendData: TrendData[] = [
    { month: 'Jan', 'CO2 Reduction (t)': 50 },
    { month: 'Feb', 'CO2 Reduction (t)': 65 },
    { month: 'Mar', 'CO2 Reduction (t)': 90 },
    { month: 'Apr', 'CO2 Reduction (t)': 85 },
    { month: 'May', 'CO2 Reduction (t)': 120 },
    { month: 'Jun', 'CO2 Reduction (t)': 150 },
    { month: 'Jul', 'CO2 Reduction (t)': 180 },
    { month: 'Aug', 'CO2 Reduction (t)': 210 },
];


const KpiCard: React.FC<{ data: KpiData }> = ({ data }) => {
  const isIncrease = data.changeType === 'increase';
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
            <div className="bg-emerald-50 text-primary p-3 rounded-full">
                {data.icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{data.title}</p>
                <p className="text-3xl font-bold text-gray-800">{data.value}</p>
            </div>
        </div>
        <div className={`flex items-center text-sm font-semibold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
          {isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
          <span>{data.change}</span>
        </div>
      </div>
       <p className="text-xs text-gray-500 mt-2">{data.description}</p>
    </div>
  );
};


const EmissionsChart: React.FC = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-[400px]">
         <h3 className="text-lg font-semibold text-gray-800 mb-4">Emissions by Source (tCO₂e)</h3>
        <ResponsiveContainer width="100%" height="90%">
            <BarChart data={emissionsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="source" tick={{ fontSize: 12 }}/>
                <YAxis tick={{ fontSize: 12 }}/>
                <Tooltip wrapperClassName="!bg-white !border-gray-300 !rounded-lg !shadow-lg" />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '14px' }} />
                <Bar dataKey="emissions" name="Emissions" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

const TrendChart: React.FC = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-[400px]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Carbon Reduction Trend</h3>
        <ResponsiveContainer width="100%" height="90%">
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip wrapperClassName="!bg-white !border-gray-300 !rounded-lg !shadow-lg" />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '14px' }}/>
                <Line type="monotone" dataKey="CO2 Reduction (t)" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);


const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Welcome back, Manager!</h2>
        <p className="text-gray-500 mt-1">Here's your sustainability and cost-efficiency overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} data={kpi} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmissionsChart />
          <TrendChart />
      </div>
    </div>
  );
};

export default Dashboard;
