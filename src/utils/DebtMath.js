export const calculatePayoff = (
  initialDebts,
  extraPayment,
  method
) => {
  let debts = JSON.parse(JSON.stringify(initialDebts));
  let totalInterestPaid = 0;
  let months = 0;
  const chartData = [];

  let totalMinPayment = debts.reduce((sum, d) => sum + d.minPayment, 0);
  let totalPayment = totalMinPayment + extraPayment;

  while (debts.some(d => d.balance > 0)) {
    months++;
    let interestForMonth = 0;

    // Calculate interest for the month
    debts.forEach(debt => {
      if (debt.balance > 0) {
        const monthlyInterest = (debt.balance * (debt.rate / 100)) / 12;
        interestForMonth += monthlyInterest;
        debt.balance += monthlyInterest;
      }
    });

    totalInterestPaid += interestForMonth;

    // Make minimum payments
    let paymentPool = totalPayment;
    debts.forEach(debt => {
      if (debt.balance > 0) {
        const payment = Math.min(debt.balance, debt.minPayment);
        debt.balance -= payment;
        paymentPool -= payment;
      }
    });

    // Sort debts based on the strategy for applying extra payments
    if (method === 'snowball') {
      debts.sort((a, b) => a.balance - b.balance);
    } else { // avalanche
      debts.sort((a, b) => b.rate - a.rate);
    }

    // Apply remaining payment pool (extra payment + freed up minimums)
    for (const debt of debts) {
      if (paymentPool <= 0) break;
      if (debt.balance > 0) {
        const appliedPayment = Math.min(debt.balance, paymentPool);
        debt.balance -= appliedPayment;
        paymentPool -= appliedPayment;
      }
    }

    // Record chart data for the end of the month
    const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
    chartData.push({
      month: months,
      'Total Balance': parseFloat(totalBalance.toFixed(2)),
    });
    
    const paidOffDebtsThisMonth = [];
    debts.forEach(d => {
        if(d.balance <= 0) {
            paidOffDebtsThisMonth.push(d);
        }
    });

    if(paidOffDebtsThisMonth.length > 0) {
        const newlyFreedUpPayments = paidOffDebtsThisMonth.reduce((sum, d) => {
            const initialDebt = initialDebts.find(idebt => idebt.id === d.id);
            return sum + (initialDebt?.minPayment || 0);
        }, 0);
        
        let currentTotalMinPayment = debts.reduce((sum, d) => {
            const initialDebt = initialDebts.find(idebt => idebt.id === d.id);
            if(d.balance > 0) {
                 return sum + (initialDebt?.minPayment || 0);
            }
            return sum;
        }, 0);
        
        totalPayment = currentTotalMinPayment + extraPayment + newlyFreedUpPayments;
    }
    
    debts = debts.filter(d => d.balance > 0);

    if (months > 1200) { // Safety break after 100 years
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
