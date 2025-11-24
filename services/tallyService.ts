
import { MonthlyData, LedgerItem, TallyConfig, SalesTransaction, PurchaseTransaction, DashboardKPIs, Alert, ReceivablesData, Company } from '../types';
import { buildTallyRequest, parseXml, getTagValue } from '../utils/xmlHelper';
import { MockApi } from './mockApi';

export const checkTallyConnection = async (baseUrl: string): Promise<boolean> => {
  try {
    const body = `<EXPORTDATA><REQUESTDESC><REPORTNAME>List of Accounts</REPORTNAME></REQUESTDESC></EXPORTDATA>`;
    const xml = buildTallyRequest('Export Data', body);
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: xml,
      mode: 'cors'
    });

    return response.ok;
  } catch (error) {
    console.warn("Tally connection failed:", error);
    return false;
  }
};

export const getCompanies = async (config: TallyConfig): Promise<Company[]> => {
  if (config.isDemoMode) return MockApi.getCompanies();
  return []; // Implement real Tally company fetch
};

export const fetchDashboardData = async (
  config: TallyConfig, 
  companyId: string,
  dateRange: { start: string, end: string }
): Promise<{
  kpis: DashboardKPIs;
  monthly: MonthlyData[];
  receivables: ReceivablesData[];
  alerts: Alert[];
}> => {
  if (config.isDemoMode) {
    const [kpis, monthly, receivables, alerts] = await Promise.all([
      MockApi.getKPIs(companyId, dateRange.start, dateRange.end),
      MockApi.getMonthlyData(companyId),
      MockApi.getReceivables(companyId),
      MockApi.getAlerts(companyId)
    ]);
    return { kpis, monthly, receivables, alerts };
  }

  // Real implementation would fetch distinct reports
  return {
    kpis: { revenue: 0, netProfit: 0, cashBalance: 0, gstPayable: 0 },
    monthly: [],
    receivables: [],
    alerts: []
  };
};

export const fetchSales = async (config: TallyConfig, companyId: string, page = 1, size = 10) => {
  if (config.isDemoMode) return MockApi.getSalesVouchers(companyId, page, size);
  return { data: [], total: 0 };
};

export const fetchPurchases = async (config: TallyConfig, companyId: string, page = 1, size = 10) => {
  if (config.isDemoMode) return MockApi.getPurchaseVouchers(companyId, page, size);
  return { data: [], total: 0 };
};
