
export interface FinancialMetric {
  label: string;
  value: number;
  trend?: number; // percentage
  prefix?: string;
  color?: string;
}

export interface DateRange {
  start: string; // ISO Date
  end: string; // ISO Date
}

export interface Company {
  id: string;
  name: string;
  gstin: string;
  currency: string;
}

export interface MonthlyData {
  month: string;
  sales: number;
  purchase: number;
  expenses: number;
}

export interface LedgerItem {
  id: string;
  name: string;
  closingBalance: number;
  group: string;
  email?: string;
}

export interface AgingBucket {
  range: string; // '0-30', '31-60', '61-90', '90+'
  amount: number;
  invoices: number;
}

export interface ReceivablesData {
  customerName: string;
  totalDue: number;
  buckets: {
    '0-30': number;
    '31-60': number;
    '61-90': number;
    '90+': number;
  };
}

export interface SalesItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface SalesTransaction {
  id: string;
  date: string;
  invoiceNo: string;
  partyName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items?: SalesItem[];
  rawXml?: string; // For audit tab
}

export interface PurchaseTransaction {
  id: string;
  date: string;
  invoiceNo: string;
  partyName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items?: SalesItem[];
  rawXml?: string;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  date: string;
  isRead: boolean;
}

export interface TallyConfig {
  baseUrl: string; 
  isDemoMode: boolean;
}

export interface DashboardKPIs {
  revenue: number;
  netProfit: number;
  cashBalance: number;
  gstPayable: number;
}

export interface AIInsight {
  summary: string;
  recommendation: string;
  riskAssessment: 'Low' | 'Medium' | 'High';
}

export enum TallyStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting...',
  ERROR = 'Connection Error'
}
