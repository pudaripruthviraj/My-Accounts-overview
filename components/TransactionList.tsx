import React, { useState } from 'react';
import { Plus, Trash2, Search, Filter, X } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onAddTransaction, onDeleteTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Form State
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.Food);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAddTransaction({
      amount: parseFloat(amount),
      type,
      category,
      description,
      date: new Date(date).toISOString(),
    });

    // Reset
    setAmount('');
    setDescription('');
    setIsModalOpen(false);
  };

  const filteredTransactions = transactions
    .filter(t => filter === 'all' ? true : t.type === filter)
    .filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-4 rounded-2xl border border-slate-700 shadow-lg">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
            {['all', 'income', 'expense'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === f ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 w-full md:w-auto"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Add New</span>
            <span className="md:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 bg-surface rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 p-2">
            {filteredTransactions.length > 0 ? (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase sticky top-0 backdrop-blur-md">
                    <tr>
                        <th className="p-4 font-semibold rounded-tl-lg">Date</th>
                        <th className="p-4 font-semibold">Category</th>
                        <th className="p-4 font-semibold">Description</th>
                        <th className="p-4 font-semibold text-right">Amount</th>
                        <th className="p-4 font-semibold text-center rounded-tr-lg">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                    {filteredTransactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-700/30 transition-colors group">
                        <td className="p-4 text-slate-300 text-sm whitespace-nowrap">
                            {new Date(t.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-600 text-slate-300 whitespace-nowrap">
                            {t.category}
                            </span>
                        </td>
                        <td className="p-4 text-white font-medium text-sm">{t.description}</td>
                        <td className={`p-4 text-right font-bold text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                            <button 
                            onClick={() => onDeleteTransaction(t.id)}
                            className="p-2 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                            <Trash2 size={16} />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 p-10">
                    <Filter size={48} className="mb-4 opacity-50" />
                    <p>No transactions found.</p>
                </div>
            )}
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">Add Transaction</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => { setType('expense'); setCategory(Category.Food); }}
                    className={`py-2 rounded-xl text-sm font-semibold transition-all ${type === 'expense' ? 'bg-red-500/10 text-red-500 border border-red-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700'}`}
                >
                    Expense
                </button>
                <button
                    type="button"
                    onClick={() => { setType('income'); setCategory(Category.Salary); }}
                    className={`py-2 rounded-xl text-sm font-semibold transition-all ${type === 'income' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/50' : 'bg-slate-900 text-slate-400 border border-slate-700'}`}
                >
                    Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Amount</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input 
                        type="number" 
                        required
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                        placeholder="0.00"
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
                >
                    {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <input 
                    type="text" 
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="e.g. Weekly Groceries"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none [color-scheme:dark]"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all mt-4"
              >
                Save Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;