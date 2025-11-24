
import React, { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShoppingCart, 
  Settings, 
  Menu,
  Database,
  Moon,
  Sun,
  Building,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Company, DateRange, TallyStatus } from '../types';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tallyStatus: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  companies: Company[];
  selectedCompanyId: string;
  onCompanyChange: (id: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, onTabChange, tallyStatus, 
  isDarkMode, onToggleTheme, 
  companies, selectedCompanyId, onCompanyChange,
  dateRange, onDateRangeChange
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales Register', icon: TrendingUp },
    { id: 'purchase', label: 'Purchase Register', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900';
      case 'Connecting...': return 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900';
      case 'Connection Error': return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900';
      default: return 'text-slate-500 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 dark:bg-black text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex lg:flex-col border-r border-slate-800
      `}>
        <div className="flex items-center h-16 px-6 bg-slate-950 dark:bg-black border-b border-slate-800">
          <Database className="w-6 h-6 text-emerald-400 mr-3" />
          <span className="text-lg font-bold tracking-wide">Tally<span className="text-emerald-400">Insight</span></span>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setSidebarOpen(false);
              }}
              className={`
                flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${activeTab === item.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
           <div className={`flex items-center justify-center p-2 rounded border text-xs font-semibold ${getStatusColor(tallyStatus)}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${tallyStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`}></div>
              {tallyStatus}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 mr-2 text-slate-500 dark:text-slate-400 rounded-md lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Company Switcher */}
            <div className="relative group hidden md:block">
               <button className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                 <Building className="w-4 h-4 text-slate-400" />
                 <span>{selectedCompany?.name || 'Select Company'}</span>
                 <ChevronDown className="w-3 h-3 text-slate-400" />
               </button>
               <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 hidden group-hover:block z-50">
                 {companies.map(c => (
                   <button 
                    key={c.id}
                    onClick={() => onCompanyChange(c.id)}
                    className={`block w-full text-left px-4 py-2 text-sm ${selectedCompanyId === c.id ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                   >
                     {c.name}
                   </button>
                 ))}
               </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             {/* Date Range Picker (Simplified) */}
             <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
               <div className="flex items-center px-2 text-slate-500 dark:text-slate-400">
                 <Calendar className="w-3.5 h-3.5 mr-2" />
                 <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => onDateRangeChange({...dateRange, start: e.target.value})}
                    className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 outline-none w-24"
                 />
               </div>
               <span className="text-slate-400">-</span>
               <div className="flex items-center px-2">
                 <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => onDateRangeChange({...dateRange, end: e.target.value})}
                    className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 outline-none w-24"
                 />
               </div>
             </div>

             {/* Theme Toggle */}
             <button 
               onClick={onToggleTheme}
               className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
             >
               {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

             <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800 text-xs">
               AD
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
