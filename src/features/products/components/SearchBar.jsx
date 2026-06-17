import React from 'react';

export const SearchBar = ({ value, onChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <input
        type="text"
        placeholder="Buscar por nombre o ID..."
        value={value}
        onChange={onChange}
        className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500"
      />
    </div>
  );
};
