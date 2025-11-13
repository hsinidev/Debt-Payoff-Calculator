
export interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

export interface ChartData {
  month: number;
  [key: string]: number; // Allows for dynamic keys like 'Snowball Balance' and 'Avalanche Balance'
}

export interface PayoffResult {
  payoffDate: string;
  totalInterestPaid: number;
  totalMonths: number;
  chartData: ChartData[];
}
