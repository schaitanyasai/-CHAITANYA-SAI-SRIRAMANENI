import React, { useState, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { OptimizationRecommendation, ScenarioForecastPoint, CalculatorResult } from '../types';
// Fix: Corrected icon import from 'OptimizeIcon' to 'OptimizerIcon' and added missing 'CalculatorIcon'.
import { UploadIcon, OptimizerIcon, SimulateIcon, CheckCircleIcon, CrossCircleIcon, InfoIcon, CalculatorIcon } from './Icons';
import { getCarbonFootprint, getOptimizationStrategies, getScenarioForecast } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="text-gray-600">Analyzing...</span>
    </div>
);

const FeatureHeader: React.FC<{title: string, subtitle: string}> = ({title, subtitle}) => (
    <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 mt-1">{subtitle}</p>
    </div>
);

export const DataSourceManager: React.FC = () => {
    const [files, setFiles] = useState<FileList | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(event.target.files);
    };

    return (
        <div>
            <FeatureHeader title="Data Sources" subtitle="Integrate your company and public data." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* File Upload */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Company Data</h3>
                    <p className="text-sm text-gray-500 mb-4">Upload ESG reports, logistics data, or utility bills (CSV, XLSX).</p>
                    <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <label htmlFor="file-upload" className="mt-4 text-sm font-medium text-primary hover:text-primary-focus cursor-pointer">
                            <span>Select files to upload</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                    </div>
                    {files && files.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-sm">Selected files:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {/* Fix: Explicitly type 'file' as File to resolve property 'name' does not exist error. */}
                                {Array.from(files).map((file: File, index) => <li key={index}>{file.name}</li>)}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Data Connectors */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect Data Sources</h3>
                    <p className="text-sm text-gray-500 mb-4">Link to open datasets and real-time IoT feeds.</p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">EPA Emission Factors</p>
                                <p className="text-sm text-gray-500">Public dataset</p>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"><CheckCircleIcon className="w-4 h-4" /> Connected</button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">IoT Sensor Feed</p>
                                <p className="text-sm text-gray-500">Real-time energy consumption</p>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Connect</button>
                        </div>
                         <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">Kaggle: Building Efficiency</p>
                                <p className="text-sm text-gray-500">Public dataset</p>
                            </div>
                             <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"><CheckCircleIcon className="w-4 h-4" /> Connected</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CarbonFootprintCalculator: React.FC = () => {
    const [energy, setEnergy] = useState('150000');
    const [transport, setTransport] = useState('50000');
    const [waste, setWaste] = useState('25');
    const [result, setResult] = useState<CalculatorResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const inputData = { energy_kwh: energy, transport_miles: transport, waste_tonnes: waste };
            const res = await getCarbonFootprint(inputData);
            setResult(res);
        } catch (err) {
            setError('Failed to calculate carbon footprint. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <FeatureHeader title="Carbon Footprint Calculator" subtitle="Estimate emissions from your business operations." />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Input Your Data</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Energy Consumption (kWh/year)</label>
                            <input type="number" value={energy} onChange={(e) => setEnergy(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Logistics (miles/year)</label>
                            <input type="number" value={transport} onChange={(e) => setTransport(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Waste Generated (tonnes/year)</label>
                            <input type="number" value={waste} onChange={(e) => setWaste(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <button onClick={handleCalculate} disabled={isLoading} className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-focus disabled:bg-gray-400 flex items-center justify-center gap-2">
                            {/* Fix: Added import for CalculatorIcon to resolve 'Cannot find name' error. */}
                            <CalculatorIcon className="w-5 h-5" /> Calculate
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Results</h3>
                    {isLoading && <LoadingSpinner />}
                    {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg flex items-center gap-2"><CrossCircleIcon /> {error}</div>}
                    {result && (
                         <div className="space-y-4">
                             <div className="text-center bg-emerald-50 p-6 rounded-lg">
                                 <p className="text-sm text-gray-600">Total Estimated Emissions</p>
                                 <p className="text-4xl font-bold text-primary">{result.total_emissions.toFixed(2)}</p>
                                 <p className="text-sm text-gray-600">tonnes of CO₂e</p>
                             </div>
                              <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={result.breakdown} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" />
                                        <YAxis dataKey="source" type="category" width={80} />
                                        <Tooltip />
                                        <Bar dataKey="emissions" fill="#059669" name="Emissions (tCO₂e)" />
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                         </div>
                    )}
                     {!isLoading && !result && !error && (
                        <div className="text-center py-16 text-gray-500">
                            <InfoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4">Your carbon footprint analysis will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const OptimizationEngine: React.FC = () => {
    const [goal, setGoal] = useState('15');
    const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOptimize = async () => {
        setIsLoading(true);
        setError(null);
        setRecommendations([]);
        try {
            const res = await getOptimizationStrategies(parseInt(goal));
            setRecommendations(res);
        } catch (err) {
            setError('Failed to generate optimization strategies. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <FeatureHeader title="AI-Powered Optimization Engine" subtitle="Find the optimal balance between cost and sustainability." />
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <label className="font-medium text-gray-700">I want to reduce carbon emissions by:</label>
                    <input type="number" value={goal} onChange={e => setGoal(e.target.value)} className="w-32 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    <span className="font-medium text-gray-700">%</span>
                    <button onClick={handleOptimize} disabled={isLoading} className="bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-primary-focus disabled:bg-gray-400 flex items-center justify-center gap-2 md:ml-auto">
                       {/* Fix: Replaced incorrect 'OptimizeIcon' with 'OptimizerIcon'. */}
                       <OptimizerIcon /> Find Strategies
                    </button>
                </div>
            </div>
            
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg flex items-center gap-2"><CrossCircleIcon /> {error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-lg text-primary">{rec.strategy}</h4>
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Carbon Reduction:</span>
                                <span className="font-bold text-green-600">{rec.carbon_reduction_percent}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Cost Impact:</span>
                                <span className={`font-bold ${rec.cost_change_percent > 0 ? 'text-red-600' : 'text-green-600'}`}>{rec.cost_change_percent > 0 ? '+' : ''}{rec.cost_change_percent}%</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-4 pt-4 border-t">{rec.trade_offs}</p>
                    </div>
                ))}
            </div>
            {!isLoading && recommendations.length === 0 && !error && (
                <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
                    <InfoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4">AI-powered recommendations will appear here.</p>
                </div>
            )}
        </div>
    );
};

export const WhatIfScenario: React.FC = () => {
    const [scenario, setScenario] = useState('ev_fleet');
    const [forecast, setForecast] = useState<ScenarioForecastPoint[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scenarioDescriptions: {[key: string]: string} = {
        'ev_fleet': "Transitioning 30% of our vehicle fleet to electric vehicles over the next five years.",
        'solar_panels': "Installing solar panels to cover 50% of our electricity needs.",
        'supply_chain': "Switching to a supplier with a 20% lower carbon footprint for our top 3 raw materials."
    };

    const handleSimulate = async () => {
        setIsLoading(true);
        setError(null);
        setForecast([]);
        try {
            const res = await getScenarioForecast(scenarioDescriptions[scenario]);
            setForecast(res);
        } catch (err) {
            setError('Failed to generate scenario forecast. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <FeatureHeader title="Predictive 'What-If' Scenarios" subtitle="Simulate the long-term impact of strategic decisions." />
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <label className="font-medium text-gray-700">Select a scenario to model:</label>
                    <select value={scenario} onChange={e => setScenario(e.target.value)} className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                        <option value="ev_fleet">Transition 30% of fleet to EVs</option>
                        <option value="solar_panels">Cover 50% of electricity with solar</option>
                        <option value="supply_chain">Switch to a greener supplier</option>
                    </select>
                    <button onClick={handleSimulate} disabled={isLoading} className="bg-secondary text-white py-2 px-6 rounded-lg font-semibold hover:bg-sky-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
                        <SimulateIcon /> Run Simulation
                    </button>
                </div>
            </div>
            
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg flex items-center gap-2"><CrossCircleIcon /> {error}</div>}
            
            {forecast.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-[400px]">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Projected Cost Savings ($)</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={forecast}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="cost_savings" stroke="#059669" name="Cost Savings ($)" />
                            </LineChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-[400px]">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Projected CO₂ Reduction (tonnes)</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={forecast}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="co2_reduction_tonnes" stroke="#0284c7" name="CO₂ Reduction (t)" />
                            </LineChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            )}
             {!isLoading && forecast.length === 0 && !error && (
                <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
                    <InfoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4">Your simulation results will appear here.</p>
                </div>
            )}
        </div>
    );
};