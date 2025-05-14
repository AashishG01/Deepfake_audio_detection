import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 py-6 px-4 border-t border-gray-200">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-600">
          © {new Date().getFullYear()} DeepFake Detector. Powered by AI.
        </p>
      </div>
    </footer>
  );
};

export default Footer;