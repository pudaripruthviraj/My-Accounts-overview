import { Category, Transaction, Account } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 5000,
    type: 'income',
    category: Category.Salary,
    date: new Date(new Date().setDate(1)).toISOString(), // 1st of current month
    description: 'Monthly Salary'
  },
  {
    id: '2',
    amount: 1200,
    type: 'expense',
    category: Category.Housing,
    date: new Date(new Date().setDate(2)).toISOString(),
    description: 'Rent Payment'
  },
  {
    id: '3',
    amount: 150,
    type: 'expense',
    category: Category.Utilities,
    date: new Date(new Date().setDate(5)).toISOString(),
    description: 'Electric Bill'
  },
  {
    id: '4',
    amount: 400,
    type: 'expense',
    category: Category.Food,
    date: new Date(new Date().setDate(10)).toISOString(),
    description: 'Groceries'
  },
  {
    id: '5',
    amount: 100,
    type: 'expense',
    category: Category.Entertainment,
    date: new Date(new Date().setDate(12)).toISOString(),
    description: 'Movie Night'
  },
  {
    id: '6',
    amount: 50,
    type: 'expense',
    category: Category.Transportation,
    date: new Date(new Date().setDate(15)).toISOString(),
    description: 'Uber'
  }
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc_1',
    name: 'Primary Checking',
    institution: 'Chase',
    type: 'checking',
    balance: 4500.50,
    identifier: 'john.doe@chase',
    lastSynced: new Date().toISOString()
  },
  {
    id: 'acc_2',
    name: 'High Yield Savings',
    institution: 'Ally',
    type: 'savings',
    balance: 12000.00,
    identifier: 'john.savings@ally',
    lastSynced: new Date().toISOString()
  },
  {
    id: 'acc_3',
    name: 'Sapphire Preferred',
    institution: 'Chase',
    type: 'credit',
    balance: 1250.00, // Liability
    identifier: 'xxx-xxx-4242',
    lastSynced: new Date().toISOString()
  }
];

export const EXPENSE_CATEGORIES = [
  Category.Housing,
  Category.Food,
  Category.Transportation,
  Category.Utilities,
  Category.Insurance,
  Category.Healthcare,
  Category.Personal,
  Category.Entertainment,
  Category.Other
];

export const INCOME_CATEGORIES = [
  Category.Salary,
  Category.Freelance,
  Category.Investment,
  Category.Savings, // Sometimes moving from savings is treated as inflow in simple apps
  Category.Other
];