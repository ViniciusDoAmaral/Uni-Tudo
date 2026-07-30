import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThemeMode, PrimaryColor } from '../types';
import {
  AlertTriangle,
  Flame,
  RotateCcw,
  Sliders,
  AlertCircle,
  Cloud,
  CloudCheck,
  RefreshCw,
  LogOut,
  User,
  CheckCircle2,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    products,
    settings,
    updateSettings,
    resetToInitialData,
    user,
    syncStatus,
    lastSyncTime,
    loginGoogle,
    logoutGoogle,
    triggerManualSync,
  } = useApp();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempMinMargin, setTempMinMargin] = useState(settings.defaultMinMarginPercent);
  const [tempBusinessName, setTempBusinessName] = useState(settings.businessName);
  const [tempThemeMode, setTempThemeMode] = useState<ThemeMode>(settings.themeMode || 'wood');
  const [tempPrimaryColor, setTempPrimaryColor] = useState<PrimaryColor>(settings.primaryColor || 'emerald');

  // Calculate alerts
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStock).length;
  const lowMarginCount = products.filter((p) => {
    const totalCost = p.costPrice + p.customizationCost;
    if (p.finalPrice <= 0 || totalCost <= 0) return false;
    const margin = ((p.finalPrice - totalCost) / p.finalPrice) * 100;
    return margin < (p.lowMarginThreshold || settings.defaultMinMarginPercent);
  }).length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      defaultMinMarginPercent: Number(tempMinMargin),
      businessName: tempBusinessName,
      themeMode: tempThemeMode,
      primaryColor: tempPrimaryColor,
    });
    setShowSettingsModal(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#2C1E16] text-[#FAF6F0] shadow-md border-b border-[#3D2B20]">
      <div className="w-full max-w-5xl md:max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-hidden">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#7A4B29] to-[#2E6F40] flex items-center justify-center text-white shadow-inner font-bold text-lg border border-[#8C5A32] shrink-0">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#E2C392]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm sm:text-base tracking-tight text-[#FDFBF7] truncate">
                Uni Tudo
              </h1>
              <span className="hidden xs:flex text-[10px] font-semibold bg-[#2E6F40] text-[#EAF3EC] px-1.5 py-0.5 rounded-full border border-[#438250] items-center gap-1 shrink-0">
                <CloudCheck className="w-3 h-3 text-emerald-300" />
                Nuvem
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#CBBBA8] truncate max-w-[120px] sm:max-w-[220px]">
              {settings.businessName}
            </p>
          </div>
        </div>

        {/* Quick Indicators, Cloud Sync, Theme Toggle & Settings Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PROMINENT THEME TOGGLE BUTTON */}
          <button
            onClick={() => {
              const nextMode: ThemeMode =
                settings.themeMode === 'light'
                  ? 'dark'
                  : settings.themeMode === 'dark'
                  ? 'wood'
                  : 'light';
              updateSettings({ themeMode: nextMode });
              setTempThemeMode(nextMode);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4A382C] to-[#3A2A20] hover:from-[#5A483C] hover:to-[#4A382C] text-[#E2C392] transition-all border border-[#5D493C] flex items-center justify-center gap-1.5 shrink-0 shadow-xs active:scale-95 cursor-pointer"
            title={`Tema atual: ${
              settings.themeMode === 'light'
                ? 'Claro (Branco)'
                : settings.themeMode === 'dark'
                ? 'Escuro'
                : 'Madeira'
            }. Clique para alternar o tema.`}
          >
            {settings.themeMode === 'light' && (
              <>
                <Sun className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-[11px] font-bold text-amber-200">Claro</span>
              </>
            )}
            {settings.themeMode === 'dark' && (
              <>
                <Moon className="w-4 h-4 text-indigo-300 shrink-0" />
                <span className="text-[11px] font-bold text-indigo-200">Escuro</span>
              </>
            )}
            {(settings.themeMode === 'wood' || !settings.themeMode) && (
              <>
                <Palette className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] font-bold text-amber-300">Madeira</span>
              </>
            )}
          </button>

          {/* Real-time Cloud Sync Badge */}
          <button
            onClick={() => triggerManualSync()}
            title={`Sincronização em tempo real (${syncStatus}). Clique para forçar sincronização.`}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#3A2A20] border border-[#4D392C] text-[11px] font-medium text-[#E2C392] hover:bg-[#4A382C] transition-colors shrink-0"
          >
            {syncStatus === 'connected' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden md:inline">Online</span>
              </>
            )}
            {syncStatus === 'syncing' && (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                <span className="hidden md:inline">Sincronizando...</span>
              </>
            )}
            {syncStatus === 'offline' && (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="hidden md:inline text-rose-300">Off-line</span>
              </>
            )}
          </button>

          {(lowStockCount > 0 || lowMarginCount > 0) && (
            <div className="hidden xs:flex items-center gap-1 shrink-0">
              {lowStockCount > 0 && (
                <span
                  title={`${lowStockCount} produtos com estoque crítico`}
                  className="flex items-center gap-1 text-[11px] font-bold bg-[#E65100]/20 text-[#FFB74D] px-2 py-0.5 rounded-md border border-[#F57C00]/40"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {lowStockCount}
                </span>
              )}
              {lowMarginCount > 0 && (
                <span
                  title={`${lowMarginCount} produtos com margem baixa`}
                  className="flex items-center gap-1 text-[11px] font-bold bg-[#D32F2F]/20 text-[#EF9A9A] px-2 py-0.5 rounded-md border border-[#E57373]/40"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {lowMarginCount}
                </span>
              )}
            </div>
          )}

          {/* User Profile / Settings */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 rounded-xl bg-[#3A2A20] hover:bg-[#4A382C] text-[#D8C9B8] transition-colors border border-[#4D392C] flex items-center gap-1.5 shrink-0"
            title="Conta Google e Configurações de Tema"
          >
            {user ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-[#8C5A32]"
              />
            ) : (
              <User className="w-4 h-4 text-[#E2C392]" />
            )}
            <Sliders className="w-3.5 h-3.5 text-[#CBBBA8]" />
          </button>
        </div>
      </div>

      {/* Settings & Google Auth Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] text-[#2C1E16] w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-[#E0D5C3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] mb-4">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-[#2E6F40]" />
                <h3 className="font-bold text-base text-[#2C1E16]">
                  Nuvem & Conta Google
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            {/* Google Authentication Box */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E2D6C3] shadow-xs mb-4">
              {user ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-[#2E6F40] shadow-xs object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-xs font-bold text-[#2E6F40]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Autenticado com Google
                      </div>
                      <p className="font-semibold text-sm text-[#2C1E16] truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                    <span>Sincronização em Tempo Real:</span>
                    <span className="font-semibold text-[#2E6F40] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Ativa {lastSyncTime ? `(${lastSyncTime})` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => logoutGoogle()}
                    className="w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair da Conta Google
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <p className="text-xs text-[#5C4D3E]">
                    Conecte sua conta Google para sincronizar o banco de dados online em tempo real entre múltiplos dispositivos.
                  </p>
                  <button
                    onClick={() => loginGoogle()}
                    className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Entrar com a Conta Google
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#5C4D3E] mb-1">
                  Nome do Estabelecimento / Marca
                </label>
                <input
                  type="text"
                  value={tempBusinessName}
                  onChange={(e) => setTempBusinessName(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16] focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C4D3E] mb-1">
                  Margem Mínima para Alerta (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={tempMinMargin}
                    onChange={(e) => setTempMinMargin(Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16] focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-bold">
                    %
                  </span>
                </div>
              </div>

              {/* Theme & Appearance Customization */}
              <div className="space-y-2 pt-2 border-t border-[#E8DEC8]">
                <label className="block text-xs font-bold text-[#5C4D3E] flex items-center gap-1">
                  <Palette className="w-4 h-4 text-[#7A4B29]" /> Aparência & Tema do App
                </label>

                {/* Theme Mode Selector Cards */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTempThemeMode('light')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      tempThemeMode === 'light'
                        ? 'bg-white border-[#2E6F40] text-[#2E6F40] font-bold shadow-xs ring-2 ring-[#2E6F40]/20'
                        : 'bg-white/80 border-[#DCD1BF] text-gray-700 hover:bg-white'
                    }`}
                  >
                    <Sun className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                    <span className="text-[10px] block leading-tight">Claro (Branco)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTempThemeMode('dark')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      tempThemeMode === 'dark'
                        ? 'bg-[#182230] border-indigo-400 text-indigo-300 font-bold shadow-xs ring-2 ring-indigo-400/20'
                        : 'bg-[#182230]/80 border-gray-700 text-gray-300 hover:bg-[#182230]'
                    }`}
                  >
                    <Moon className="w-4 h-4 mx-auto mb-1 text-indigo-300" />
                    <span className="text-[10px] block leading-tight">Modo Escuro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTempThemeMode('wood')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      tempThemeMode === 'wood' || !tempThemeMode
                        ? 'bg-[#FAF6F0] border-[#7A4B29] text-[#7A4B29] font-bold shadow-xs ring-2 ring-[#7A4B29]/20'
                        : 'bg-[#FAF6F0]/80 border-[#DCD1BF] text-[#7A6A58] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <Flame className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                    <span className="text-[10px] block leading-tight">Madeira</span>
                  </button>
                </div>

                {/* Primary Accent Color Selector */}
                <div>
                  <span className="text-[10px] font-bold text-[#7A6A58] block mb-1">
                    Cor de Destaque:
                  </span>
                  <div className="flex items-center justify-between gap-1 bg-white p-1.5 rounded-xl border border-[#DCD1BF]">
                    {[
                      { id: 'emerald', bg: 'bg-[#2E6F40]', label: 'Verde Gaúcho' },
                      { id: 'amber', bg: 'bg-[#7A4B29]', label: 'Marrom Madeira' },
                      { id: 'blue', bg: 'bg-[#1E40AF]', label: 'Azul Safira' },
                      { id: 'rose', bg: 'bg-[#9F1239]', label: 'Vinho Tradicional' },
                      { id: 'purple', bg: 'bg-[#6D28D9]', label: 'Roxo Elegante' },
                    ].map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        title={col.label}
                        onClick={() => setTempPrimaryColor(col.id as PrimaryColor)}
                        className={`w-7 h-7 rounded-full ${col.bg} transition-all flex items-center justify-center text-white ${
                          tempPrimaryColor === col.id
                            ? 'ring-2 ring-offset-2 ring-black scale-110 shadow-sm'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {tempPrimaryColor === col.id && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8DEC8] flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2E6F40] hover:bg-[#235832] text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  Salvar Configurações
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Deseja restaurar os dados iniciais de demonstração (produtos, pedidos e estoque)?')) {
                      resetToInitialData();
                      setShowSettingsModal(false);
                    }
                  }}
                  className="w-full py-2 bg-transparent hover:bg-[#EFE8DB] text-[#7A4B29] font-medium text-xs rounded-xl border border-[#D4C5B0] transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar Dados Iniciais
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
