import React, { useState } from 'react';
import { Bot, Sparkles, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// import { getFinancialAdvice } from '../services/geminiService';
import { Transaction, Account } from '../types';

interface AIAdvisorProps {
  transactions: Transaction[];
  accounts: Account[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions, accounts }) => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');

  const handleAsk = async () => {
    if (!question.trim() && !response) {
      // Allow initial analysis without a specific question
    } else if (!question.trim()) {
        return;
    }

    setLoading(true);
    const result = await getFinancialAdvice(transactions, accounts, question);
    setResponse(result);
    setLoading(false);
    setQuestion('');
  };

  const handleQuickPrompt = (prompt: string) => {
    setQuestion(prompt);
  };

  const quickPrompts = [
    "What is my current net worth?",
    "How can I reduce my debt faster?",
    "Analyze my spending habits.",
    "Do I have enough savings?"
  ];

  return (
    <div className="h-[calc(100vh-2rem)] md:h-auto flex flex-col max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <div className="p-4 bg-indigo-500/20 rounded-2xl border border-indigo-400/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
          <Bot size={48} className="text-indigo-300" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Financial Advisor</h2>
          <p className="text-indigo-200/80 max-w-lg">
            Powered by Gemini, I analyze your entire financial picture—bank accounts, debts, and transactions—to provide holistic financial advice.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-surface border border-slate-700 rounded-3xl p-6 min-h-[400px] flex flex-col shadow-xl">
        
        {/* Output */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-4">
          {!response && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
              <Sparkles size={48} className="mb-4 text-slate-600" />
              <p>Ask me anything about your net worth or spending...</p>
            </div>
          )}

          {loading && (
            <div className="flex items-start gap-4 animate-pulse">
               <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={20} className="text-indigo-400" />
               </div>
               <div className="space-y-3 w-full">
                 <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                 <div className="h-4 bg-slate-700 rounded w-5/6"></div>
               </div>
            </div>
          )}

          {response && !loading && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                 <Bot size={20} className="text-indigo-400" />
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 bg-slate-800/50 p-6 rounded-2xl rounded-tl-none border border-slate-700/50">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="space-y-4">
            {/* Quick Prompts */}
            {!response && (
                <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((p, i) => (
                    <button 
                        key={i}
                        onClick={() => handleQuickPrompt(p)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 px-3 py-1.5 rounded-full transition-colors"
                    >
                        {p}
                    </button>
                    ))}
                </div>
            )}

            <div className="relative">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    placeholder="Ask about your finances..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-6 pr-14 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent shadow-inner"
                />
                <button 
                    onClick={handleAsk}
                    disabled={loading || (!question && !response && transactions.length === 0)}
                    className="absolute right-2 top-2 p-2 bg-primary hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-lg transition-colors"
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;