import React from 'react';
import { useApp } from '../context/AppContext';
import { getThemeStyles } from '../utils/theme';
import { Home, LayoutDashboard, Package, Warehouse, ShoppingCart, Users } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, products, orders, settings } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Aguardando Gravação' || o.status === 'Em Produção' || o.status === 'Orçamento'
  ).length;

  const lowStockCount = products.filter((p) => p.currentStock <= p.minStock).length;

  const themeMode = settings.themeMode || 'wood';
  const themeStyles = getThemeStyles(settings.primaryColor);

  const navBg =
    themeMode === 'light'
      ? 'bg-white border-slate-200 text-slate-700 shadow-md'
      : themeMode === 'dark'
      ? 'bg-[#182230] border-[#253248] text-gray-300 shadow-md'
      : 'bg-[#FAF6F0] border-[#E6DEC3] text-[#6C5B4C] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]';

  const activeItemStyle = themeStyles.activeNav;

  const inactiveItemStyle =
    themeMode === 'light'
      ? 'text-slate-500 hover:text-slate-900'
      : themeMode === 'dark'
      ? 'text-gray-400 hover:text-white'
      : 'text-[#6C5B4C] hover:text-[#2C1E16]';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 ${navBg} border-t transition-colors duration-200`}>
      <div className="w-full max-w-5xl md:max-w-6xl mx-auto px-2 sm:px-6 py-1.5 flex items-center justify-around sm:justify-center sm:gap-8 md:gap-12">
        {/* Tab 0: Home / Início */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all ${
            activeTab === 'home' ? activeItemStyle : inactiveItemStyle
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Início</span>
        </button>

        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all ${
            activeTab === 'dashboard' ? activeItemStyle : inactiveItemStyle
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Painel</span>
        </button>

        {/* Tab 2: Products */}
        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all ${
            activeTab === 'products' ? activeItemStyle : inactiveItemStyle
          }`}
        >
          <Package className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Produtos</span>
        </button>

        {/* Tab 3: Inventory */}
        <button
          onClick={() => setActiveTab('inventory')}
          className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all ${
            activeTab === 'inventory' ? activeItemStyle : inactiveItemStyle
          }`}
        >
          <Warehouse className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Estoque</span>
          {lowStockCount > 0 && (
            <span className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-[#E65100] animate-pulse" />
          )}
        </button>

        {/* Tab 4: Orders/Sales */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all ${
            activeTab === 'orders' ? activeItemStyle : inactiveItemStyle
          }`}
        >
          <ShoppingCart className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Vendas</span>
          {activeOrdersCount > 0 && (
            <span className={`absolute -top-0.5 right-0.5 ${themeStyles.bgPrimary} text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white`}>
              {activeOrdersCount}
            </span>
          )}
        </button>

        {/* Tab 5: Customers */}
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all ${
            activeTab === 'customers' ? activeItemStyle : inactiveItemStyle
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Clientes</span>
        </button>
      </div>
    </nav>
  );
};
