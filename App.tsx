import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AIAdvisor from './components/AIAdvisor';
import AccountsView from './components/AccountsView';
import { Transaction, ViewState, Account } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_ACCOUNTS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  console.log("Current View:", view);
  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    setView('dashboard');
    const saved = localStorage.getItem('financeFlowTransactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved transactions");
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Accounts State
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('financeFlowAccounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved accounts");
      }
    }
    return INITIAL_ACCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem('financeFlowTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('financeFlowAccounts', JSON.stringify(accounts));
  }, [accounts]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const t: Transaction = { ...newTransaction, id: uuidv4() };
    setTransactions(prev => [t, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddAccount = (newAccount: Account) => {
    setAccounts(prev => [...prev, newAccount]);
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="flex h-screen bg-background text-slate-200 overflow-hidden font-sans">
      <Sidebar currentView={view} onViewChange={setView} />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-8 h-full">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">
                {view === 'accounts' ? 'Accounts & Debt' : view.replace('-', ' ')}
              </h1>
              <p className="text-slate-500 text-sm">
                {view === 'dashboard' && `Overview for ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`}
                {view === 'transactions' && 'Manage your income and expenses'}
                {view === 'accounts' && 'View all your bank accounts, cards, and debts'}
                {view === 'ai-advisor' && 'Get intelligent insights powered by Gemini'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="hidden md:flex flex-col items-end mr-2">
                 <span className="text-sm font-semibold text-white">Welcome Back</span>
                 <span className="text-xs text-slate-400">Personal Account</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                 ME
               </div>
            </div>
          </header>

          <div className="h-full pb-20">
            {view === 'dashboard' && <Dashboard transactions={transactions} accounts={accounts} />}
            {view === 'transactions' && (
              <TransactionList 
                transactions={transactions} 
                onAddTransaction={handleAddTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}
            {view === 'accounts' && (
              <AccountsView 
                accounts={accounts} 
                onAddAccount={handleAddAccount}
                onRemoveAccount={handleRemoveAccount}
              />
            )}
            {view === 'ai-advisor' && <AIAdvisor transactions={transactions} accounts={accounts} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;