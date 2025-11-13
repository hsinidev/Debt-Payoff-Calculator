import React, { useState } from 'https://esm.sh/react@18.2.0';
import { calculatePayoff } from '../utils/DebtMath.js';

const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = (window).Recharts;

const DebtInputRow = ({ debt, onUpdate, onRemove }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center p-3 bg-gray-800 rounded-lg">
            <input
                type="text"
                placeholder="Debt Name (e.g., Credit Card)"
                value={debt.name}
                onChange={(e) => onUpdate(debt.id, 'name', e.target.value)}
                className="col-span-1 md:col-span-2 bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
                type="number"
                placeholder="Balance"
                value={debt.balance || ''}
                onChange={(e) => onUpdate(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
                type="number"
                placeholder="Interest Rate (%)"
                value={debt.rate || ''}
                onChange={(e) => onUpdate(debt.id, 'rate', parseFloat(e.target.value) || 0)}
                className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    placeholder="Min. Payment"
                    value={debt.minPayment || ''}
                    onChange={(e) => onUpdate(debt.id, 'minPayment', parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button onClick={() => onRemove(debt.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded transition-colors">&times;</button>
            </div>
        </div>
    );
};


const DebtCalculatorTool = () => {
    const [debts, setDebts] = useState([
        { id: '1', name: 'Credit Card', balance: 5000, rate: 18.9, minPayment: 100 },
        { id: '2', name: 'Student Loan', balance: 20000, rate: 5.5, minPayment: 250 },
    ]);
    const [extraPayment, setExtraPayment] = useState(200);
    const [snowballResult, setSnowballResult] = useState(null);
    const [avalancheResult, setAvalancheResult] = useState(null);

    const addDebt = () => {
        setDebts([...debts, { id: Date.now().toString(), name: '', balance: 0, rate: 0, minPayment: 0 }]);
    };

    const updateDebt = (id, field, value) => {
        setDebts(debts.map(d => d.id === id ? { ...d, [field]: value } : d));
    };

    const removeDebt = (id) => {
        setDebts(debts.filter(d => d.id !== id));
    };

    const handleCalculate = () => {
        const validDebts = debts.filter(d => d.balance > 0 && d.rate >= 0 && d.minPayment > 0);
        if (validDebts.length === 0) {
            alert("Please add at least one valid debt.");
            return;
        }
        setSnowballResult(calculatePayoff(validDebts, extraPayment, 'snowball'));
        setAvalancheResult(calculatePayoff(validDebts, extraPayment, 'avalanche'));
    };
    
    const combinedChartData = snowballResult && avalancheResult ? snowballResult.chartData.map((snowballPoint, index) => {
        const avalanchePoint = avalancheResult.chartData[index];
        return {
            month: snowballPoint.month,
            'Snowball Balance': snowballPoint['Total Balance'],
            'Avalanche Balance': avalanchePoint['Total Balance'],
        }
    }) : [];

    return (
        <div className="bg-black bg-opacity-40 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700">
            <div className="space-y-4 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Your Debts</h2>
                {debts.map(debt => <DebtInputRow key={debt.id} debt={debt} onUpdate={updateDebt} onRemove={removeDebt} />)}
                <button onClick={addDebt} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    + Add Another Debt
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
                <div>
                    <label htmlFor="extraPayment" className="block text-lg font-medium text-gray-200 mb-2">Extra Monthly Payment</label>
                    <input
                        id="extraPayment"
                        type="number"
                        value={extraPayment || ''}
                        onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xl"
                        placeholder="e.g., 200"
                    />
                </div>
                <button onClick={handleCalculate} className="w-full self-end bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform transform hover:scale-105">
                    Calculate Payoff Strategies
                </button>
            </div>
            
            {snowballResult && avalancheResult && (
                <div className="mt-10 animate-fade-in">
                    <h2 className="text-3xl font-bold text-center text-white mb-8">Results Comparison</h2>
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Snowball Results */}
                        <div className="bg-gray-800 p-6 rounded-lg border border-blue-500">
                            <h3 className="text-2xl font-bold text-blue-400">Snowball Method</h3>
                            <p className="text-gray-400 text-sm mb-4">(Focus: Smallest Balance First)</p>
                            <p className="text-lg">Payoff Date: <span className="font-bold text-white">{snowballResult.payoffDate}</span></p>
                            <p className="text-lg">Total Interest Paid: <span className="font-bold text-white">{snowballResult.totalInterestPaid.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></p>
                        </div>
                        {/* Avalanche Results */}
                        <div className="bg-gray-800 p-6 rounded-lg border border-purple-500">
                            <h3 className="text-2xl font-bold text-purple-400">Avalanche Method</h3>
                            <p className="text-gray-400 text-sm mb-4">(Focus: Highest Interest First - Cheapest!)</p>
                            <p className="text-lg">Payoff Date: <span className="font-bold text-white">{avalancheResult.payoffDate}</span></p>
                            <p className="text-lg">Total Interest Paid: <span className="font-bold text-white">{avalancheResult.totalInterestPaid.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></p>
                        </div>
                    </div>
                    
                    <div className="h-96 bg-gray-800 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={combinedChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis dataKey="month" stroke="#A0AEC0" label={{ value: 'Months', position: 'insideBottom', offset: -10, fill: '#A0AEC0' }} />
                                <YAxis stroke="#A0AEC0" tickFormatter={(value) => `$${(value/1000)}k`} />
                                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} labelStyle={{ color: '#E2E8F0' }} />
                                <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                                <Line type="monotone" dataKey="Snowball Balance" stroke="#3B82F6" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Avalanche Balance" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebtCalculatorTool;
