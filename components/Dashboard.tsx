
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  ArrowUpRight, RefreshCcw, Sparkles, 
  DollarSign, Briefcase, Wallet, TrendingUp, Bell, AlertTriangle, Info, X, ChevronRight
} from 'lucide-react';
import { MonthlyData, DashboardKPIs, AIInsight, ReceivablesData, Alert } from '../types';
import { generateFinancialInsight } from '../services/geminiService';
import ReceivablesAging from './ReceivablesAging';

interface DashboardProps {
  data: {
    monthly: MonthlyData[];
    kpis: DashboardKPIs;
    receivables: ReceivablesData[];
    alerts: Alert[];
  };
  isLoading: boolean;
  onRefresh: () => void;
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ data, isLoading, onRefresh }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Mock totals for Gemini prompt
  const totals = {
    sales: data.kpis.revenue,
    purchase: data.kpis.revenue * 0.7,
    cash: data.kpis.cashBalance
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await generateFinancialInsight(data.monthly, totals);
      setInsight(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const getMetricBreakdown = (metric: string, total: number) => {
    switch (metric) {
      case 'Revenue':
        return [
          { name: 'Sales Account (Goods)', value: total * 0.65 },
          { name: 'Service Income', value: total * 0.25 },
          { name: 'Other Income', value: total * 0.10 },
        ];
      case 'Net Profit':
        return [
          { name: 'Operating Profit', value: total * 0.8 },
          { name: 'Non-Operating Income', value: total * 0.2 },
        ];
      case 'Cash Balance':
        return [
          { name: 'HDFC Bank', value: total * 0.55 },
          { name: 'SBI Current', value: total * 0.35 },
          { name: 'Petty Cash', value: total * 0.10 },
        ];
      case 'GST Payable':
        return [
          { name: 'Output CGST', value: total * 0.45 },
          { name: 'Output SGST', value: total * 0.45 },
          { name: 'Output IGST', value: total * 0.10 },
        ];
      default:
        return [];
    }
  };

  const MetricCard = ({ title, value, icon: Icon, colorClass, rawValue }: any) => (
    <div 
      onClick={() => setSelectedMetric(title)}
      className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
      </div>
      <div className="flex justify-between items-start mb-4">
         <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
         </div>
         <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
            <ArrowUpRight className="w-3 h-3 mr-1" /> 12.5%
         </span>
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-1 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">{title}</h3>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <p className="text-xs text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Click for details</p>
    </div>
  );

  const AlertItem = ({ alert }: { alert: Alert }) => (
    <div className={`flex gap-3 p-3 rounded-lg border ${
      alert.type === 'critical' ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/50' : 
      alert.type === 'warning' ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/50' : 
      'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/50'
    }`}>
      {alert.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />}
      {alert.type === 'warning' && <Bell className="w-5 h-5 text-amber-500 flex-shrink-0" />}
      {alert.type === 'info' && <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />}
      <div>
        <p className={`text-sm font-medium ${
          alert.type === 'critical' ? 'text-red-800 dark:text-red-200' : 
          alert.type === 'warning' ? 'text-amber-800 dark:text-amber-200' : 
          'text-blue-800 dark:text-blue-200'
        }`}>{alert.message}</p>
        <p className="text-xs text-slate-400 mt-1">{new Date(alert.date).toLocaleDateString()}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Key Performance Indicators & Alerts</p>
        </div>
        <div className="flex space-x-3">
           <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <Sparkles className={`w-4 h-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? 'AI Analysis' : 'Ask AI Analyst'}
          </button>
          <button 
            onClick={onRefresh}
            className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
          >
            <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* AI Insight Panel */}
      {insight && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-indigo-600 dark:text-indigo-400" />
           </div>
           <h3 className="text-indigo-900 dark:text-indigo-200 font-bold flex items-center mb-3">
             <Sparkles className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" /> 
             AI Financial Insight
           </h3>
           <div className="grid md:grid-cols-3 gap-6 relative z-10">
             <div className="col-span-2">
               <p className="text-indigo-900 dark:text-indigo-100 font-medium mb-1">Summary</p>
               <p className="text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">{insight.summary}</p>
             </div>
             <div>
               <div className="bg-white/60 dark:bg-slate-900/50 rounded-lg p-3 mb-2">
                 <p className="text-xs text-indigo-800 dark:text-indigo-300 font-bold uppercase">Strategic Advice</p>
                 <p className="text-sm text-indigo-900 dark:text-indigo-100 mt-1">{insight.recommendation}</p>
               </div>
               <div className="flex items-center justify-between bg-white/60 dark:bg-slate-900/50 rounded-lg p-2 px-3">
                 <span className="text-xs text-indigo-800 dark:text-indigo-300 font-bold">Risk Level</span>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                   insight.riskAssessment === 'Low' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 
                   insight.riskAssessment === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                 }`}>
                   {insight.riskAssessment}
                 </span>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Revenue" 
          value={formatCurrency(data.kpis.revenue)} 
          rawValue={data.kpis.revenue}
          icon={TrendingUp} 
          colorClass="bg-emerald-500 text-emerald-600" 
        />
        <MetricCard 
          title="Net Profit" 
          value={formatCurrency(data.kpis.netProfit)} 
          rawValue={data.kpis.netProfit}
          icon={DollarSign} 
          colorClass="bg-indigo-500 text-indigo-600" 
        />
        <MetricCard 
          title="Cash Balance" 
          value={formatCurrency(data.kpis.cashBalance)} 
          rawValue={data.kpis.cashBalance}
          icon={Wallet} 
          colorClass="bg-amber-500 text-amber-600" 
        />
        <MetricCard 
          title="GST Payable" 
          value={formatCurrency(data.kpis.gstPayable)} 
          rawValue={data.kpis.gstPayable}
          icon={Briefcase} 
          colorClass="bg-purple-500 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales vs Purchase Trend */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Revenue vs Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.1)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#1e293b' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="sales" name="Sales" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="purchase" name="Purchase" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Alerts & Notifications</h3>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">{data.alerts.length} New</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]">
             {data.alerts.length > 0 ? (
               data.alerts.map(alert => <AlertItem key={alert.id} alert={alert} />)
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Bell className="w-8 h-8 mb-2 opacity-20" />
                  <span className="text-sm">No new alerts</span>
               </div>
             )}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium border border-indigo-100 dark:border-indigo-900/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
      
      {/* Receivables Aging Module */}
      <ReceivablesAging data={data.receivables} />

      {/* KPI Detail Modal */}
      {selectedMetric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedMetric} Breakdown</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Detailed component analysis</p>
              </div>
              <button 
                onClick={() => setSelectedMetric(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getMetricBreakdown(
                            selectedMetric, 
                            selectedMetric === 'Revenue' ? data.kpis.revenue : 
                            selectedMetric === 'Net Profit' ? data.kpis.netProfit :
                            selectedMetric === 'Cash Balance' ? data.kpis.cashBalance :
                            data.kpis.gstPayable
                          )}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {getMetricBreakdown(selectedMetric, 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide">Component Breakdown</h3>
                    <div className="space-y-3">
                      {getMetricBreakdown(
                            selectedMetric, 
                            selectedMetric === 'Revenue' ? data.kpis.revenue : 
                            selectedMetric === 'Net Profit' ? data.kpis.netProfit :
                            selectedMetric === 'Cash Balance' ? data.kpis.cashBalance :
                            data.kpis.gstPayable
                          ).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                           <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                           </div>
                           <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-sm text-slate-500">Total</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          {formatCurrency(
                             selectedMetric === 'Revenue' ? data.kpis.revenue : 
                             selectedMetric === 'Net Profit' ? data.kpis.netProfit :
                             selectedMetric === 'Cash Balance' ? data.kpis.cashBalance :
                             data.kpis.gstPayable
                          )}
                        </span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
