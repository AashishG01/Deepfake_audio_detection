import React, { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import Header from './components/Header';
import ResultDisplay from './components/ResultDisplay';
import Footer from './components/Footer';
import { AlertCircle } from 'lucide-react';

interface DetectionResult {
  label: string;
  probability: number;
  explanation: string;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);

  // Reset all states
  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="mr-2 h-5 w-5" />
              <p>{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto text-red-500 hover:text-red-700"
              >
                Dismiss
              </button>
            </div>
          )}

          {!result ? (
            <AudioUploader 
              setIsLoading={setIsLoading} 
              setError={setError} 
              setResult={setResult} 
              isLoading={isLoading}
            />
          ) : (
            <ResultDisplay 
              result={result} 
              onReset={handleReset}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;