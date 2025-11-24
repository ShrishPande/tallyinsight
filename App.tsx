'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SalesRegister from './components/SalesRegister';
import PurchaseRegister from './components/PurchaseRegister';
import Settings from './components/Settings';
import { TallyConfig, TallyStatus, Company, DateRange, DashboardKPIs, MonthlyData, ReceivablesData, Alert } from './types';
import { checkTallyConnection, fetchDashboardData, getCompanies } from './services/tallyService';

const DEFAULT_CONFIG: TallyConfig = {
  baseUrl: 'http://localhost:9000',
  isDemoMode: true
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [config, setConfig] = useState<TallyConfig>(DEFAULT_CONFIG);
  const [status, setStatus] = useState<TallyStatus>(TallyStatus.DISCONNECTED);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Global Data State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({ start: '2024-04-01', end: '2024-09-30' });

  const [dashboardData, setDashboardData] = useState<{
    kpis: DashboardKPIs, monthly: MonthlyData[], receivables: ReceivablesData[], alerts: Alert[]
  } | null>(null);

  const connectAndFetch = useCallback(async () => {
    setLoading(true);
    setStatus(TallyStatus.CONNECTING);

    try {
      // 1. Check Connection
      if (!config.isDemoMode) {
        const isConnected = await checkTallyConnection(config.baseUrl);
        if (!isConnected) {
          setStatus(TallyStatus.ERROR);
          setLoading(false);
          return;
        }
      }
      setStatus(TallyStatus.CONNECTED);

      // 2. Fetch Companies (if not loaded)
      let currentCompanyId = selectedCompanyId;
      if (companies.length === 0) {
        const loadedCompanies = await getCompanies(config);
        setCompanies(loadedCompanies);
        if (loadedCompanies.length > 0) {
          currentCompanyId = loadedCompanies[0].id;
          setSelectedCompanyId(currentCompanyId);
        }
      }

      // 3. Fetch Dashboard Data if we have a company selected
      if (currentCompanyId) {
        const data = await fetchDashboardData(config, currentCompanyId, dateRange);
        setDashboardData(data);
      }

    } catch (error) {
      console.error(error);
      setStatus(TallyStatus.ERROR);
    } finally {
      setLoading(false);
    }
  }, [config, selectedCompanyId, dateRange, companies.length]);

  // Initial load & Config changes
  useEffect(() => {
    connectAndFetch();
  }, [connectAndFetch]);

  // Theme toggle logic
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    if (activeTab === 'settings') {
      return (
        <Settings
          config={config}
          onSave={(newConfig) => {
            setConfig(newConfig);
            setCompanies([]); // Reset companies to force re-fetch
            setActiveTab('dashboard');
          }}
        />
      );
    }

    if (status === TallyStatus.ERROR && activeTab !== 'settings') {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Connection Failed</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">Could not connect to Tally Prime at {config.baseUrl}. <br />Ensure Tally is open or switch to Demo Mode.</p>
          <button onClick={() => setActiveTab('settings')} className="text-emerald-600 font-medium hover:underline">Go to Settings</button>
        </div>
      );
    }

    if (!dashboardData && loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Initializing Dashboard...</div>;
    if (!dashboardData) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">No data available.</div>;

    if (activeTab === 'dashboard') {
      return (
        <Dashboard
          data={dashboardData}
          isLoading={loading}
          onRefresh={connectAndFetch}
        />
      );
    }

    if (activeTab === 'sales') {
      return (
        <SalesRegister config={config} companyId={selectedCompanyId} />
      );
    }

    if (activeTab === 'purchase') {
      return (
        <PurchaseRegister config={config} companyId={selectedCompanyId} />
      );
    }

    return null;
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tallyStatus={status}
      isDarkMode={isDarkMode}
      onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      companies={companies}
      selectedCompanyId={selectedCompanyId}
      onCompanyChange={setSelectedCompanyId}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
