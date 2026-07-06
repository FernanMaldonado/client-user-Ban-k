import { useState, useEffect } from 'react';
import { axiosUser } from '../../../shared/api/api';
import { ArrowRightLeft, RefreshCw, DollarSign, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export const DivisasWidget = () => {
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('GTQ');
    const [result, setResult] = useState(null);
    const [lastUpdate, setLastUpdate] = useState('');

    const fetchRates = async () => {
        setLoading(true);
        try {
            const res = await axiosUser.get('/divisas/rates');
            if (res.data?.success && res.data?.data) {
                setRates(res.data.data.rates);
                setLastUpdate(new Date(res.data.data.date).toLocaleString());
            }
        } catch (error) {
            console.error('Error fetching rates:', error);
            toast.error('Error al cargar las tasas de cambio');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const handleConvert = () => {
        if (!rates || !amount) return;

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum)) {
            toast.error('Ingrese un monto válido');
            return;
        }

        const rateFrom = parseFloat(rates[fromCurrency]);
        const rateTo = parseFloat(rates[toCurrency]);

        if (!rateFrom || !rateTo) {
            toast.error('Tasa de cambio no disponible para las monedas seleccionadas');
            return;
        }

        const inUsd = amountNum / rateFrom;
        const converted = inUsd * rateTo;

        setResult(converted.toFixed(4));
    };

    const popularCurrencies = ['USD', 'EUR', 'GTQ', 'GBP', 'MXN', 'JPY'];

    return (
        <div className="p-6 bg-white/90 backdrop-blur-xl border border-teal-100 rounded-2xl shadow-md w-full max-w-md mt-6 transition-all hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h5 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </div>
                        Divisas Globales
                    </h5>
                    <p className="text-sm text-slate-500 font-normal mt-1 ml-11">
                        Actualizado: {lastUpdate || 'Cargando...'}
                    </p>
                </div>
                <button
                    onClick={fetchRates}
                    disabled={loading}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex flex-col gap-5">
                <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Monto a convertir</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="w-5 h-5 text-teal-400" />
                        </div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-800 font-medium"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">De</label>
                        <select
                            value={fromCurrency}
                            onChange={(val) => setFromCurrency(val.target.value)}
                            className="block w-full py-2.5 px-3 border border-slate-300 bg-white rounded-xl focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-800"
                        >
                            {popularCurrencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div
                        className="p-3 bg-teal-50 rounded-full text-teal-600 shadow-sm border border-teal-100 cursor-pointer hover:bg-teal-100 transition-colors mb-1"
                        onClick={() => {
                            const temp = fromCurrency;
                            setFromCurrency(toCurrency);
                            setToCurrency(temp);
                            setResult(null);
                        }}
                    >
                        <ArrowRightLeft className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">A</label>
                        <select
                            value={toCurrency}
                            onChange={(val) => setToCurrency(val.target.value)}
                            className="block w-full py-2.5 px-3 border border-slate-300 bg-white rounded-xl focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-800"
                        >
                            {popularCurrencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleConvert}
                    disabled={loading || !amount}
                >
                    Convertir Valor
                </button>

                {result !== null && (
                    <div className="mt-4 p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 text-center animate-in zoom-in duration-300">
                        <p className="text-sm text-slate-600 font-medium mb-1">
                            {amount} {fromCurrency} =
                        </p>
                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                            {result} <span className="text-xl font-bold text-teal-800">{toCurrency}</span>
                        </h3>

                        {rates && rates[fromCurrency] && rates[toCurrency] && (
                            <p className="text-xs text-slate-500 font-medium mt-2">
                                1 {fromCurrency} = {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {rates && (
                <div className="mt-8 pt-5 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                        <Globe className="w-4 h-4 text-teal-500" />
                        Mercado Actual (Base USD)
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 text-center border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <span className="text-xs text-slate-500 font-medium block mb-1">USD/EUR</span>
                            <span className="font-black text-sm text-slate-800">{parseFloat(rates['EUR']).toFixed(2)}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 text-center border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <span className="text-xs text-slate-500 font-medium block mb-1">USD/GTQ</span>
                            <span className="font-black text-sm text-slate-800">{parseFloat(rates['GTQ']).toFixed(2)}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 text-center border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <span className="text-xs text-slate-500 font-medium block mb-1">USD/MXN</span>
                            <span className="font-black text-sm text-slate-800">{parseFloat(rates['MXN']).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}
            <span className="text-xs text-slate-500 font-medium mt-2 flex text-center justify-center">
                Tipos de cambio provistos por <a href="https://currencyfreaks.com/" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:text-teal-600 transition-colors font-medium ml-1">
                    CurrencyFreaks
                </a>
            </span>
        </div>
    );
};
