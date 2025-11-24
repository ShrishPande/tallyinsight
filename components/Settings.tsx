import React from 'react';
import { TallyConfig } from '../types';
import { Save, Server, ShieldAlert } from 'lucide-react';

interface SettingsProps {
  config: TallyConfig;
  onSave: (config: TallyConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onSave }) => {
  const [localConfig, setLocalConfig] = React.useState<TallyConfig>(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localConfig);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Server className="w-5 h-5 mr-2 text-slate-600" />
            Connection Settings
          </h2>
          <p className="text-sm text-slate-500 mt-1">Configure how the dashboard connects to Tally Prime.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tally Prime API URL
            </label>
            <input
              type="text"
              value={localConfig.baseUrl}
              onChange={(e) => setLocalConfig({...localConfig, baseUrl: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
              placeholder="http://localhost:9000"
            />
            <p className="text-xs text-slate-500 mt-2">
              Default Tally port is 9000. Ensure Tally is running.
            </p>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
             <input 
               type="checkbox" 
               id="demoMode"
               checked={localConfig.isDemoMode}
               onChange={(e) => setLocalConfig({...localConfig, isDemoMode: e.target.checked})}
               className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
             />
             <label htmlFor="demoMode" className="flex-1">
                <span className="block text-sm font-medium text-amber-900">Enable Demo Mode</span>
                <span className="block text-xs text-amber-700">Use this if you don't have Tally running locally or encounter CORS issues.</span>
             </label>
          </div>

          {/* CORS Warning */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start">
             <ShieldAlert className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
             <div className="text-sm text-blue-800">
               <p className="font-semibold mb-1">CORS Configuration Required</p>
               <p>To connect to Tally directly from the browser, you may need to start Tally with CORS enabled or use a local proxy server because browsers block requests to localhost by default.</p>
             </div>
          </div>

          <div className="pt-4 flex justify-end">
             <button
               type="submit"
               className="flex items-center px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
             >
               <Save className="w-4 h-4 mr-2" />
               Save Configuration
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;