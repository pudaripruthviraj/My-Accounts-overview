import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Building2, CreditCard } from 'lucide-react';
import { Transaction, Account } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  accounts: Account[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

const Dashboard: React.FC<DashboardProps> = ({ transactions, accounts }) => {
  const summary = useMemo(() => {
    // Transaction Summary (Cash Flow)
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    
    // Account Summary (Balance Sheet)
    const totalAssets = accounts
      .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
      .reduce((acc, a) => acc + a.balance, 0);
      
    const totalLiabilities = accounts
      .filter(a => ['credit', 'loan'].includes(a.type))
      .reduce((acc, a) => acc + a.balance, 0);

    const netWorth = totalAssets - totalLiabilities;

    return {
      income,
      expense,
      balance: income - expense, // Monthly cash flow balance
      totalAssets,
      totalLiabilities,
      netWorth
    };
  }, [transactions, accounts]);

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const data: Record<string, { name: string; income: number; expense: number }> = {};
    
    // Fill last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toLocaleString('default', { month: 'short' });
        data[key] = { name: key, income: 0, expense: 0 };
    }

    transactions.forEach(t => {
        const d = new Date(t.date);
        const key = d.toLocaleString('default', { month: 'short' });
        if (data[key]) {
            if (t.type === 'income') data[key].income += t.amount;
            else data[key].expense += t.amount;
        }
    });

    return Object.values(data);
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Row: Net Worth & Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Worth */}
        <div className="bg-surface p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/20 transition-all"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 font-medium mb-1">Net Worth</p>
              <h3 className="text-3xl font-bold text-white">${summary.netWorth.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl">
              <TrendingUp className="text-primary" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-slate-400">Total Assets - Total Debt</span>
          </div>
        </div>

        {/* Total Assets */}
        <div className="bg-surface p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 font-medium mb-1">Total Assets</p>
              <h3 className="text-3xl font-bold text-white">${summary.totalAssets.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl">
              <Building2 className="text-success" size={24} />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
             Across {accounts.filter(a => ['checking', 'savings', 'investment'].includes(a.type)).length} accounts
          </div>
        </div>

        {/* Total Debt */}
        <div className="bg-surface p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 font-medium mb-1">Total Debt</p>
              <h3 className="text-3xl font-bold text-white">${summary.totalLiabilities.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl">
              <CreditCard className="text-danger" size={24} />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
             Loans & Credit Cards
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white pt-4">Monthly Cash Flow</h3>
      
      {/* Second Row: Monthly stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
             <div>
                 <p className="text-slate-400 text-xs uppercase font-bold">Income (Month)</p>
                 <p className="text-xl font-bold text-emerald-400">+${summary.income.toLocaleString()}</p>
             </div>
             <ArrowUpRight className="text-emerald-500 opacity-50" />
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
             <div>
                 <p className="text-slate-400 text-xs uppercase font-bold">Expenses (Month)</p>
                 <p className="text-xl font-bold text-red-400">-${summary.expense.toLocaleString()}</p>
             </div>
             <ArrowDownRight className="text-red-500 opacity-50" />
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
             <div>
                 <p className="text-slate-400 text-xs uppercase font-bold">Net Flow</p>
                 <p className={`text-xl font-bold ${summary.balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                    {summary.balance >= 0 ? '+' : ''}${summary.balance.toLocaleString()}
                 </p>
             </div>
             <Wallet className="text-blue-500 opacity-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-surface p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Monthly Activity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-surface p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">Expense Breakdown</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
             {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '0.75rem', color: '#f8fafc' }}
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      iconType="circle"
                      formatter={(value, entry: any) => <span className="text-slate-300 ml-2">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
               <div className="text-slate-500 flex flex-col items-center">
                 <Wallet size={48} className="mb-2 opacity-50" />
                 <p>No expenses recorded yet.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;