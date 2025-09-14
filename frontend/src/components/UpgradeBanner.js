import React from 'react';

export default function UpgradeBanner({ isFree, reachedLimit, onUpgrade, isAdmin }) {
  if (!isFree || !reachedLimit) return null;
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-yellow-800">You have reached the Free plan limit (3 notes). Upgrade to Pro for unlimited notes.</p>
        </div>
        <div>
          <button onClick={onUpgrade} disabled={!isAdmin} className={`px-3 py-1 rounded ${isAdmin ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>Upgrade to Pro</button>
        </div>
      </div>
    </div>
  );
}
