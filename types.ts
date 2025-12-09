export type TransactionType = 'income' | 'expense';

export enum Category {
  Housing = 'Housing',
  Food = 'Food',
  Transportation = 'Transportation',
  Utilities = 'Utilities',
  Insurance = 'Insurance',
  Healthcare = 'Healthcare',
  Savings = 'Savings',
  Personal = 'Personal',
  Entertainment = 'Entertainment',
  Salary = 'Salary',
  Freelance = 'Freelance',
  Investment = 'Investment',
  Other = 'Other'
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO string
  description: string;
}

export type AccountType = 'checking' | 'savings' | 'credit' | 'loan' | 'investment';

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: AccountType;
  balance: number; // For liabilities, this is the amount owed
  identifier: string; // UPI or Interac ID
  lastSynced: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export type ViewState = 'dashboard' | 'transactions' | 'accounts' | 'ai-advisor';