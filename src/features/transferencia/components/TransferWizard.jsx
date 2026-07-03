import React, { useEffect } from 'react';
import { useTransferStore } from '../store/transferStore';
import { Step1Accounts } from './Step1Accounts';
import { Step2Confirm } from './Step2Confirm';

export const TransferWizard = () => {
    const { step, fetchMisCuentas, fetchMisContactos, loadingCuentas, loadingContactos } = useTransferStore();

    useEffect(() => {
        fetchMisCuentas();
        fetchMisContactos();
    }, []);

    return (
        <div className="max-w-xl mx-auto w-full bg-white rounded-[3.5rem] shadow-2xl shadow-slate-300/50 overflow-hidden border border-slate-100">
            {/* Cabecera del Wizard */}
            <div className="p-12 pb-6 flex items-center justify-between border-b border-slate-100/50 bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                        <img src="../../../src/assets/img/bank-icon-logo-design-vector-removebg-preview.png" alt="logo_bank" className="w-8 h-8 opacity-80" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-cyan-950 tracking-tighter italic leading-none">BAN-K</h2>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Servicio de Transferencias</span>
                    </div>
                </div>

                {/* Indicador de Pasos */}
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                    <div className={`w-2 h-2 rounded-full transition-colors ${step === 1 ? 'bg-cyan-950 scale-125' : 'bg-slate-200'}`} />
                    <div className="w-4 h-[2px] bg-slate-100" />
                    <div className={`w-2 h-2 rounded-full transition-colors ${step === 2 ? 'bg-cyan-950 scale-125' : 'bg-slate-200'}`} />
                </div>
            </div>

            <div className="px-12 py-10 min-h-[400px]">
                {(loadingCuentas || loadingContactos) ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <div className="w-10 h-10 border-4 border-cyan-950/20 rounded-full border-t-cyan-950 animate-spin"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargando información...</span>
                    </div>
                ) : (
                    <>
                        {step === 1 && <Step1Accounts />}
                        {step === 2 && <Step2Confirm />}
                    </>
                )}
            </div>

            {/* Decoración inferior */}
            <div className="bg-slate-50/80 p-4 text-center border-t border-slate-100">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-tighter">
                        Conexión Segura - Encriptación de Extremo a Extremo
                    </span>
                </div>
            </div>
        </div>
    );
};
