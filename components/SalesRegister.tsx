
import React, { useState, useEffect } from 'react';
import { SalesTransaction, TallyConfig } from '../types';
import { fetchSales } from '../services/tallyService';
import VoucherModal from './VoucherModal';
import { Search, Filter, Download, Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface SalesRegisterProps {
  config: TallyConfig;
  companyId: string;
}

const SalesRegister: React.FC<SalesRegisterProps> = ({ config, companyId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTransaction, setSelectedTransaction] = useState<SalesTransaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{data: SalesTransaction[], total: number}>({ data: [], total: 0 });

  const PAGE_SIZE = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, we would pass filter params to the API here
        const result = await fetchSales(config, companyId, currentPage, PAGE_SIZE);
        setData(result);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [config, companyId, currentPage]);

  // Client-side filtering for the demo data slice (In real app, server does this)
  const filteredData = data.data.filter(item => {
    const matchesSearch = 
      item.partyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(data.total / PAGE_SIZE);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-900 dark:text-emerald-400';
      case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-900 dark:text-amber-400';
      case 'Overdue': return 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-900 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300';
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const handleExport = () => {
    if (filteredData.length === 0) return;

    // Define CSV headers
    const headers = ['Date', 'Invoice No', 'Party Name', 'Amount', 'Status'];
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => {
        const date = new Date(item.date).toLocaleDateString('en-GB'); // DD/MM/YYYY
        return [
          date,
          `"${item.invoiceNo}"`, // Quote strings to handle commas
          `"${item.partyName}"`,
          item.amount,
          item.status
        ].join(',');
      })
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sales_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Register</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and view all sales invoices</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExport}
            disabled={filteredData.length === 0}
            className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoice or party name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-colors"
            />
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading data...
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Invoice No</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Party Name</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group text-slate-900 dark:text-slate-200">
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors" />
                          {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{item.invoiceNo}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-300">{item.partyName}</td>
                      <td className="px-6 py-4 text-right font-bold">{formatCurrency(item.amount)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setSelectedTransaction(item)}
                          className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 px-3 py-1.5 rounded-md font-medium text-xs transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                          <Search className="w-5 h-5 text-slate-400" />
                        </div>
                        <p>No transactions found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
           <span>Page {currentPage} of {totalPages}</span>
           <div className="flex space-x-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className={`px-3 py-1 border border-slate-200 dark:border-slate-700 rounded flex items-center ${currentPage === 1 ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages || loading}
                className={`px-3 py-1 border border-slate-200 dark:border-slate-700 rounded flex items-center ${currentPage >= totalPages ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                Next
                <ChevronRight className="w-3 h-3 ml-1" />
              </button>
           </div>
        </div>
      </div>

      {/* Transaction View Modal */}
      {selectedTransaction && (
        <VoucherModal 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
        />
      )}
    </div>
  );
};

export default SalesRegister;
