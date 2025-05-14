import React from 'react';
import { CheckCircle, XCircle, Shield, RotateCcw } from 'lucide-react';

interface ResultDisplayProps {
  result: {
    label: string;
    probability: number;
    explanation: string;
  };
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const isReal = result.label === 'Real';
  const confidencePercent = Math.round(result.probability * 100);
  
  // Animation on initial render
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    // Short delay for animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`
        bg-white p-8 rounded-lg shadow-md 
        transform transition-all duration-500 
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full mb-4">
          {isReal ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-1">
          {isReal ? 'Real Audio Detected' : 'Deepfake Detected'}
        </h2>
        <p className="text-gray-500">
          Confidence: {confidencePercent}%
        </p>
      </div>
      
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${isReal ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${confidencePercent}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-800 mt-1 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Analysis Explanation</h3>
            <p className="text-gray-700">{result.explanation}</p>
          </div>
        </div>
      </div>
      
      {!isReal && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-red-800 mb-2">Warning</h3>
          <p className="text-red-700">
            This audio appears to be AI-generated or manipulated. Be cautious about its authenticity and source.
          </p>
        </div>
      )}
      
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Analyze Another File
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;