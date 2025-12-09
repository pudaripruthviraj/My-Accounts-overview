import { GoogleGenAI } from "@google/genai";
import { Transaction, Account } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (
  transactions: Transaction[], 
  accounts: Account[],
  userQuestion?: string
): Promise<string> => {
  try {
    const transactionSummary = transactions.slice(0, 50).map(t => 
      `- ${t.date.split('T')[0]}: ${t.type.toUpperCase()} $${t.amount} (${t.category}) - ${t.description}`
    ).join('\n');

    const assetAccounts = accounts.filter(a => ['checking', 'savings', 'investment'].includes(a.type));
    const liabilityAccounts = accounts.filter(a => ['credit', 'loan'].includes(a.type));

    const totalAssets = assetAccounts.reduce((acc, a) => acc + a.balance, 0);
    const totalLiabilities = liabilityAccounts.reduce((acc, a) => acc + a.balance, 0);
    const netWorth = totalAssets - totalLiabilities;

    const accountSummary = `
      Current Financial Standing (Net Worth: $${netWorth.toFixed(2)}):
      
      Assets (Total: $${totalAssets.toFixed(2)}):
      ${assetAccounts.map(a => `- ${a.institution} ${a.name}: $${a.balance}`).join('\n')}
      
      Liabilities/Debts (Total: $${totalLiabilities.toFixed(2)}):
      ${liabilityAccounts.map(a => `- ${a.institution} ${a.name}: $${a.balance} (Owed)`).join('\n')}
    `;

    const prompt = `
      You are an expert financial advisor for a personal finance app called "FinanceFlow".
      
      Here is the user's financial overview:
      
      ${accountSummary}
      
      Recent Transactions Analysis Context:
      ${transactionSummary}
      
      ${userQuestion ? `The user has a specific question: "${userQuestion}"` : "Please provide a comprehensive financial health assessment. Focus on their Net Worth, Debt-to-Asset ratio, and spending habits from the transactions."}
      
      Provide a concise, actionable response in Markdown format. Use bolding for key points. If they have high debt, prioritize advice on paying it down.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful, encouraging, but realistic financial planner. You have access to the user's full balance sheet.",
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to my financial brain right now. Please try again later.";
  }
};