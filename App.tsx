
import React from 'react';
import ClipboardManager from './components/ClipboardManager';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-slate-900 text-slate-200 flex flex-col font-sans">
      <ClipboardManager />
    </div>
  );
};

export default App;
