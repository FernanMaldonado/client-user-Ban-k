import React from 'react';

export const SearchBar = ({ value, onChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={value}
        onChange={onChange}
        className="flex-1 bg-white border border-cyan-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400 text-gray-800 shadow-sm transition-colors"
      />
    </div>
  );
};
