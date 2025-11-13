import React from 'https://esm.sh/react@18.2.0';
import ThemeLayout from './components/ThemeLayout.tsx';
import DebtCalculatorTool from './components/DebtCalculatorTool.tsx';
import SeoArticle from './utils/SeoArticle.tsx';

const App: React.FC = () => {
  return (
    <ThemeLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Debt Payoff <span className="text-indigo-400">Calculator</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Compare Snowball vs. Avalanche strategies to find your fastest path to financial freedom.
          </p>
        </header>

        <main>
          <DebtCalculatorTool />
          <SeoArticle />
        </main>
      </div>
    </ThemeLayout>
  );
};

export default App;