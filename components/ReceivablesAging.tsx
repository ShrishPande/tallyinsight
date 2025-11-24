
import React from 'react';
import { ReceivablesData } from '../types';
import { Mail, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ReceivablesAgingProps {
  data: ReceivablesData[];
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const ReceivablesAging: React.FC<ReceivablesAgingProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Receivables Aging</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Outstanding invoices by days overdue</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
            Send Reminders
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Customer Name</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right text-emerald-600 dark:text-emerald-500">0-30 Days</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right text-amber-500">31-60 Days</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right text-orange-500">61-90 Days</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right text-red-500">90+ Days</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Total Due</th>
              <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-slate-900 dark:text-slate-200">
                <td className="px-6 py-4 font-medium">{item.customerName}</td>
                <td className="px-6 py-4 text-right">{item.buckets['0-30'] > 0 ? formatCurrency(item.buckets['0-30']) : '-'}</td>
                <td className="px-6 py-4 text-right font-medium text-amber-600 dark:text-amber-500">{item.buckets['31-60'] > 0 ? formatCurrency(item.buckets['31-60']) : '-'}</td>
                <td className="px-6 py-4 text-right font-medium text-orange-600 dark:text-orange-500">{item.buckets['61-90'] > 0 ? formatCurrency(item.buckets['61-90']) : '-'}</td>
                <td className="px-6 py-4 text-right font-bold text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/10">{item.buckets['90+'] > 0 ? formatCurrency(item.buckets['90+']) : '-'}</td>
                <td className="px-6 py-4 text-right font-bold">{formatCurrency(item.totalDue)}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button title="Send Email Reminder" className="p-1 text-slate-400 hover:text-indigo-500 transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button title="Mark Collected" className="p-1 text-slate-400 hover:text-emerald-500 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                   <div className="flex flex-col items-center">
                      <Clock className="w-10 h-10 mb-2 text-slate-300 dark:text-slate-600" />
                      No outstanding receivables found.
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceivablesAging;
