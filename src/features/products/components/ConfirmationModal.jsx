import React from 'react';

export const ConfirmationModal = ({ title, message, actions, onClose }) => {
  if (!title) return null;

  return (
    <div className="fixed inset-0 z-[100] modal-overlay hidden flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`flex-1 py-3 rounded-2xl font-bold transition ${action.className}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
