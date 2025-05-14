import React from 'react';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center mb-4">
            <Shield className="h-12 w-12 text-teal-500 mr-2" />
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
              DeepFake Detector
            </h1>
          </div>
          <p className="text-lg text-blue-700 max-w-2xl">
            Upload an audio file to determine if it's real or a deepfake, and get AI-powered
            explanations for the classification.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;