
import React, { useState } from 'react';
import { X, Printer, Download, FileText, Calendar, User, Code, FileCode } from 'lucide-react';
import { SalesTransaction, PurchaseTransaction } from '../types';

interface VoucherModalProps {
  transaction: SalesTransaction | PurchaseTransaction;
  onClose: () => void;
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const VoucherModal: React.FC<VoucherModalProps> = ({ transaction, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'xml'>('details');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900">
          <div className="flex items-start space-x-4">
             <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{transaction.invoiceNo}</h2>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  {new Date(transaction.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6">
          <button 
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Voucher Details
          </button>
          <button 
            onClick={() => setActiveTab('xml')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'xml' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <Code className="w-4 h-4 mr-2" />
            Raw XML Audit
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8 bg-white dark:bg-slate-900 min-h-[300px]">
          
          {activeTab === 'details' ? (
            <>
              {/* Status & Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 gap-4">
                 <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                 </div>
                 <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </button>
                    <button className="flex items-center px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </button>
                 </div>
              </div>

              {/* Party Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Party Details</h3>
                    <div className="flex items-start">
                       <User className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                       <div>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">{transaction.partyName}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                             Registered Client<br/>
                             Bangalore, Karnataka
                          </p>
                       </div>
                    </div>
                 </div>
                 <div className="md:text-right">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Financials</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{formatCurrency(transaction.amount)}</p>
                 </div>
              </div>

              {/* Line Items */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Line Items</h3>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Description</th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Qty</th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {transaction.items && transaction.items.length > 0 ? (
                        transaction.items.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 text-slate-900 dark:text-slate-200">
                            <td className="px-4 py-3 font-medium">{item.description}</td>
                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-6 text-center text-slate-400 italic">No detailed items available</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-right font-bold text-slate-700 dark:text-slate-300">Total</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(transaction.amount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="relative">
              <div className="absolute top-0 right-0 p-2">
                 <span className="text-xs text-slate-400 flex items-center">
                    <FileCode className="w-4 h-4 mr-1" /> Generated from Tally
                 </span>
              </div>
              <pre className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto border border-slate-200 dark:border-slate-800">
                {transaction.rawXml || '<!-- No XML data available for this transaction -->'}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;
