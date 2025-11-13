import React, { useState, ReactNode } from 'https://esm.sh/react@18.2.0';

interface ThemeLayoutProps {
  children: ReactNode;
}

const Modal: React.FC<{ title: string; content: ReactNode; onClose: () => void }> = ({ title, content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-200 border border-indigo-500">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <div className="p-6">
          {content}
        </div>
      </div>
    </div>
  );
};


const ThemeLayout: React.FC<ThemeLayoutProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const modalContent: { [key: string]: { title: string; content: ReactNode } } = {
    'About': { title: 'About Us', content: <p>This Debt Payoff Calculator is a powerful tool designed to help individuals and families take control of their financial future. We believe that with the right strategy and information, anyone can achieve their goal of becoming debt-free.</p> },
    'Contact': { title: 'Contact Us', content: <p>For support or inquiries, please reach out to us at hsini.web@gmail.com or visit our website at doodax.com.</p> },
    'Guide': { title: 'User Guide', content: <div><p>1. Enter each of your debts with its current balance, interest rate, and minimum monthly payment.</p><p>2. Add any extra amount you can pay towards your debts each month.</p><p>3. Click "Calculate Payoff Strategies" to see a comparison of the Snowball and Avalanche methods.</p></div> },
    'Privacy Policy': { title: 'Privacy Policy', content: <p>Your data is processed locally in your browser and is never sent to our servers. We respect your privacy and do not collect any personal financial information.</p> },
    'Terms of Service': { title: 'Terms of Service', content: <p>This tool is for informational purposes only and should not be considered financial advice. Please consult with a qualified financial advisor for personalized guidance.</p> },
    'DMCA': { title: 'DMCA Policy', content: <p>We respect the intellectual property of others. If you believe that your work has been copied in a way that constitutes copyright infringement, please contact us with the necessary information.</p> },
  };

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="relative min-h-screen text-gray-100 font-sans">
      <div className="fixed inset-0 z-[-1] animated-galaxy-bg"></div>
      
      <header className="bg-black bg-opacity-30 backdrop-blur-sm sticky top-0 z-40">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="text-xl font-bold text-white">DebtFree Journey</div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {Object.keys(modalContent).map(name => (
                    <button key={name} onClick={() => openModal(name)} className="text-sm text-gray-300 hover:text-white hover:underline transition-colors">
                        {name}
                    </button>
                ))}
            </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="bg-black bg-opacity-30 text-center p-6 mt-12">
        <p className="text-lg font-semibold" style={{ color: '#FFD700' }}>
            Powered by <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="hover:underline">HSINI MOHAMED</a>
        </p>
        <p className="text-sm text-gray-400 mt-2">
            Contact: hsini.web@gmail.com | <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:underline">doodax.com</a>
        </p>
      </footer>

      {activeModal && modalContent[activeModal] && (
          <Modal 
              title={modalContent[activeModal].title}
              content={modalContent[activeModal].content}
              onClose={closeModal}
          />
      )}
    </div>
  );
};

export default ThemeLayout;