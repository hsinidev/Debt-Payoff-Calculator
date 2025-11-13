import type { Debt, PayoffResult, ChartData } from '../types.ts';

export const calculatePayoff = (
  initialDebts: Debt[],
  extraPayment: number,
  method: 'snowball' | 'avalanche'
): PayoffResult => {
  // Deep copy to avoid mutating the original state
  let debts: Debt[] = JSON.parse(JSON.stringify(initialDebts));
  let totalInterestPaid = 0;
  let months = 0;
  const chartData: ChartData[] = [];

  while (debts.length > 0) {
    months++;

    // 1. Calculate the "snowball": extra payment + minimum payments of all paid-off debts.
    let snowballAmount = extraPayment;
    initialDebts.forEach(initialDebt => {
      // If an original debt is not found in the current active debts list, its minimum payment is freed up.
      if (!debts.some(d => d.id === initialDebt.id)) {
        snowballAmount += initialDebt.minPayment;
      }
    });

    // 2. Add interest for the month to all remaining debts.
    let interestForMonth = 0;
    debts.forEach(debt => {
      const monthlyInterest = (debt.balance * (debt.rate / 100)) / 12;
      interestForMonth += monthlyInterest;
      debt.balance += monthlyInterest;
    });
    totalInterestPaid += interestForMonth;

    // 3. Pay minimums on all active debts.
    // It's crucial to cap the payment at the remaining balance to handle the final payment correctly.
    debts.forEach(debt => {
      const payment = Math.min(debt.balance, debt.minPayment);
      debt.balance -= payment;
    });

    // 4. Determine the target order and apply the entire snowball amount.
    if (method === 'snowball') {
      // Sort by smallest balance first.
      debts.sort((a, b) => a.balance - b.balance);
    } else { // avalanche
      // Sort by highest interest rate first.
      debts.sort((a, b) => b.rate - a.rate);
    }

    // Apply the snowball amount to the debts in their prioritized order.
    // This handles cases where the snowball pays off one debt and rolls over to the next in the same month.
    let remainingSnowball = snowballAmount;
    for (const debt of debts) {
      if (remainingSnowball <= 0) break;
      const payment = Math.min(debt.balance, remainingSnowball);
      debt.balance -= payment;
      remainingSnowball -= payment;
    }

    // 5. Remove any debts that are now fully paid off.
    debts = debts.filter(d => d.balance > 0.001); // Use a small threshold to avoid floating point issues.

    // 6. Record data for the chart.
    const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
    chartData.push({
      month: months,
      'Total Balance': parseFloat(totalBalance.toFixed(2)),
    });
    
    // Safety break after 100 years to prevent infinite loops.
    if (months > 1200) { 
      console.error("Calculation exceeded 100 years, breaking loop.");
      break;
    }
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + months);

  return {
    payoffDate: payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
    totalInterestPaid: parseFloat(totalInterestPaid.toFixed(2)),
    totalMonths: months,
    chartData: chartData,
  };
};
