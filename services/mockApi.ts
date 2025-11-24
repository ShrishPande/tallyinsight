
import { Company, DashboardKPIs, MonthlyData, ReceivablesData, SalesTransaction, PurchaseTransaction, Alert } from '../types';

// --- MOCK DATABASE ---

const COMPANIES: Company[] = [
  { id: 'c1', name: 'Acme Corp (Demo)', gstin: '29AAACA1234A1Z5', currency: 'INR' },
  { id: 'c2', name: 'Globex Ltd (Demo)', gstin: '27ABCDE5678F1Z2', currency: 'USD' },
];

const MOCK_ALERTS: Alert[] = [
  { id: 'a1', type: 'critical', message: 'Cash balance below threshold (₹50,000)', date: '2024-09-28', isRead: false },
  { id: 'a2', type: 'warning', message: 'GST Payment due in 2 days', date: '2024-09-29', isRead: false },
  { id: 'a3', type: 'info', message: 'New Tally Connector version available', date: '2024-09-30', isRead: true },
];

const generateRawXml = (type: string, id: string, amount: number) => `
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="${type}" ACTION="Create" OBJVIEW="Invoice Voucher View">
            <DATE>20240928</DATE>
            <GUID>${id}</GUID>
            <VOUCHERNUMBER>INV-${id}</VOUCHERNUMBER>
            <PARTYLEDGERNAME>Party Name Here</PARTYLEDGERNAME>
            <FBTPAYMENTTYPE>Default</FBTPAYMENTTYPE>
            <PERSISTEDVIEW>Invoice Voucher View</PERSISTEDVIEW>
            <ENTEREDBY>Admin</ENTEREDBY>
            <EFFECTIVEDATE>20240928</EFFECTIVEDATE>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Sales Account</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>-${amount}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>
`.trim();

// --- HELPER FUNCTIONS ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API ENDPOINTS ---

export const MockApi = {
  getCompanies: async (): Promise<Company[]> => {
    await delay(500);
    return COMPANIES;
  },

  getKPIs: async (companyId: string, start: string, end: string): Promise<DashboardKPIs> => {
    await delay(600);
    // Randomize slightly based on company ID for demo feel
    const multiplier = companyId === 'c2' ? 1.5 : 1;
    return {
      revenue: 2450000 * multiplier,
      netProfit: 450000 * multiplier,
      cashBalance: 125000 * multiplier,
      gstPayable: 85000 * multiplier,
    };
  },

  getMonthlyData: async (companyId: string): Promise<MonthlyData[]> => {
    await delay(400);
    const multiplier = companyId === 'c2' ? 1.2 : 1;
    return [
      { month: 'Apr', sales: 120000 * multiplier, purchase: 80000 * multiplier, expenses: 15000 },
      { month: 'May', sales: 150000 * multiplier, purchase: 90000 * multiplier, expenses: 18000 },
      { month: 'Jun', sales: 110000 * multiplier, purchase: 85000 * multiplier, expenses: 14000 },
      { month: 'Jul', sales: 180000 * multiplier, purchase: 110000 * multiplier, expenses: 22000 },
      { month: 'Aug', sales: 190000 * multiplier, purchase: 105000 * multiplier, expenses: 20000 },
      { month: 'Sep', sales: 210000 * multiplier, purchase: 130000 * multiplier, expenses: 25000 },
    ];
  },

  getReceivables: async (companyId: string): Promise<ReceivablesData[]> => {
    await delay(700);
    const multiplier = companyId === 'c2' ? 0.8 : 1;
    return [
      { 
        customerName: 'ABC Corp', 
        totalDue: 45000 * multiplier, 
        buckets: { '0-30': 20000, '31-60': 15000 * multiplier, '61-90': 10000, '90+': 0 } 
      },
      { 
        customerName: 'XYZ Ltd', 
        totalDue: 23500 * multiplier, 
        buckets: { '0-30': 0, '31-60': 0, '61-90': 5000, '90+': 18500 * multiplier } 
      },
      { 
        customerName: 'Global Tech', 
        totalDue: 12000 * multiplier, 
        buckets: { '0-30': 12000 * multiplier, '31-60': 0, '61-90': 0, '90+': 0 } 
      },
    ];
  },

  getSalesVouchers: async (companyId: string, page: number, size: number): Promise<{data: SalesTransaction[], total: number}> => {
    await delay(500);
    // Generate 50 mock transactions
    const allSales: SalesTransaction[] = Array.from({ length: 50 }).map((_, i) => ({
      id: `INV-${1000 + i}`,
      date: new Date(2024, 8, 30 - (i % 20)).toISOString(),
      invoiceNo: `INV-24-${1000 + i}`,
      partyName: i % 3 === 0 ? 'ABC Corp' : i % 2 === 0 ? 'XYZ Ltd' : 'Global Tech',
      amount: Math.floor(Math.random() * 50000) + 5000,
      status: i % 5 === 0 ? 'Overdue' : i % 3 === 0 ? 'Pending' : 'Paid',
      rawXml: generateRawXml('Sales', `INV-${1000 + i}`, 5000),
      items: [
        { id: '1', description: 'Consulting Services', quantity: 1, unit: 'hrs', rate: 2500, amount: 2500 },
        { id: '2', description: 'Maintenance', quantity: 1, unit: 'amt', rate: 2500, amount: 2500 }
      ]
    }));

    const start = (page - 1) * size;
    return {
      data: allSales.slice(start, start + size),
      total: allSales.length
    };
  },

  getPurchaseVouchers: async (companyId: string, page: number, size: number): Promise<{data: PurchaseTransaction[], total: number}> => {
    await delay(500);
    const allPurchases: PurchaseTransaction[] = Array.from({ length: 50 }).map((_, i) => ({
      id: `PUR-${5000 + i}`,
      date: new Date(2024, 8, 30 - (i % 20)).toISOString(),
      invoiceNo: `PUR-24-${5000 + i}`,
      partyName: i % 3 === 0 ? 'Office Depot' : i % 2 === 0 ? 'Raw Material Suppliers' : 'Tech Wholesalers',
      amount: Math.floor(Math.random() * 80000) + 2000,
      status: i % 4 === 0 ? 'Pending' : 'Paid',
      rawXml: generateRawXml('Purchase', `PUR-${5000 + i}`, 8000),
      items: [
        { id: '1', description: 'Office Supplies', quantity: 10, unit: 'box', rate: 450, amount: 4500 },
        { id: '2', description: 'Printer Paper', quantity: 20, unit: 'rim', rate: 250, amount: 5000 }
      ]
    }));

    const start = (page - 1) * size;
    return {
      data: allPurchases.slice(start, start + size),
      total: allPurchases.length
    };
  },

  getAlerts: async (companyId: string): Promise<Alert[]> => {
    await delay(300);
    return MOCK_ALERTS;
  },

  exportReport: async (reportType: 'csv' | 'pdf', ids: string[]): Promise<string> => {
    await delay(1500); // Simulate generation time
    return `https://example.com/download/report-${Date.now()}.${reportType}`;
  }
};
