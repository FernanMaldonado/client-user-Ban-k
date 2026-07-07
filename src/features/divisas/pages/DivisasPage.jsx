import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { DivisasWidget } from '../components/DivisasWidget';

export const DivisasPage = () => {
    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in duration-700">
            {/* Header con las 3 opciones requeridas */}
            <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                        Módulo de <span className="text-cyan-900">Divisas</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-2">
                        Visualiza las divisas y sus tasas de cambio en tiempo real
                    </p>
                </div>
            </header>

            {/* Contenido Principal */}
            <div className="flex-1 flex items-center justify-center pb-12">
                <DivisasWidget />
            </div>

        </div>
    );
};
