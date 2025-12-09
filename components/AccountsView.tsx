import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Building2, CreditCard, Wallet, RefreshCw, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Account, AccountType } from '../types';

interface AccountsViewProps {
  accounts: Account[];
  onAddAccount: (account: Account) => void;
  onRemoveAccount: (id: string) => void;
}

const AccountsView: React.FC<AccountsViewProps> = ({ accounts, onAddAccount, onRemoveAccount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [institution, setInstitution] = useState('');
  const [type, setType] = useState<AccountType>('checking');
  const [identifier, setIdentifier] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Derive lists
  const assets = accounts.filter(a => ['checking', 'savings', 'investment'].includes(a.type));
  const liabilities = accounts.filter(a => ['credit', 'loan'].includes(a.type));

  const totalAssets = assets.reduce((acc, a) => acc + a.balance, 0);
  const totalLiabilities = liabilities.reduce((acc, a) => acc + a.balance, 0);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution || !identifier) return;

    setIsConnecting(true);

    // Simulate API Call to Bank
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate fetching random balance
    const simulatedBalance = Math.floor(Math.random() * 15000) + 500;
    
    const newAccount: Account = {
      id: uuidv4(),
      name: `${institution} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      institution,
      type,
      identifier,
      balance: simulatedBalance,
      lastSynced: new Date().toISOString()
    };

    onAddAccount(newAccount);
    setIsConnecting(false);
    setIsModalOpen(false);
    
    // Reset form
    setInstitution('');
    setIdentifier('');
    setType('checking');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Total Assets</h3>
            <Wallet className="text-emerald-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-white">${totalAssets.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-2">Cash & Investments</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Total Debt</h3>
            <CreditCard className="text-red-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-white">${totalLiabilities.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-2">Loans & Credit Cards</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Linked Accounts</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          <span>Connect Bank</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assets List */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Assets</h3>
          {assets.map(acc => (
            <div key={acc.id} className="bg-surface p-5 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-slate-600 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                  <Building2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{acc.name}</h4>
                  <p className="text-xs text-slate-500">{acc.institution} • {acc.identifier}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-400">${acc.balance.toLocaleString()}</p>
                <button 
                  onClick={() => onRemoveAccount(acc.id)}
                  className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                >
                  Unlink
                </button>
              </div>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl text-slate-500">
              No asset accounts linked.
            </div>
          )}
        </div>

        {/* Liabilities List */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Liabilities & Debt</h3>
          {liabilities.map(acc => (
            <div key={acc.id} className="bg-surface p-5 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-slate-600 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{acc.name}</h4>
                  <p className="text-xs text-slate-500">{acc.institution} • {acc.identifier}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-400">${acc.balance.toLocaleString()}</p>
                <button 
                  onClick={() => onRemoveAccount(acc.id)}
                  className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                >
                  Unlink
                </button>
              </div>
            </div>
          ))}
          {liabilities.length === 0 && (
            <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl text-slate-500">
              No debt accounts linked.
            </div>
          )}
        </div>
      </div>

      {/* Connect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">Connect Institution</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleConnect} className="p-6 space-y-4">
              {!isConnecting ? (
                <>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-blue-200">
                      Enter your UPI ID or Interac ID to securely fetch your account balance. We use 256-bit encryption.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Bank / Institution Name</label>
                    <input 
                      type="text" 
                      required
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none placeholder-slate-600"
                      placeholder="e.g. Chase, RBC, PayPal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Account Type</label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value as AccountType)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
                    >
                      <option value="checking">Checking Account</option>
                      <option value="savings">Savings Account</option>
                      <option value="investment">Investment / 401k</option>
                      <option value="credit">Credit Card (Liability)</option>
                      <option value="loan">Loan / Mortgage (Liability)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Connection ID (UPI / Interac)</label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="text" 
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none placeholder-slate-600"
                        placeholder="username@okaxis or email"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all mt-4"
                  >
                    Fetch Accounts
                  </button>
                </>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <RefreshCw className="animate-spin text-primary mb-4" size={48} />
                  <h4 className="text-lg font-bold text-white mb-2">Connecting to Bank...</h4>
                  <p className="text-slate-400 text-sm">Verifying credentials and fetching balance.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsView;