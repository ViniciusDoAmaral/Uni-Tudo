import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { InventoryView } from './components/InventoryView';
import { OrdersView } from './components/OrdersView';
import { CustomersView } from './components/CustomersView';
import { ProductFormModal } from './components/ProductFormModal';
import { NewOrderModal } from './components/NewOrderModal';

function MainAppShell() {
  const { activeTab, settings } = useApp();

  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const themeMode = settings.themeMode || 'wood';

  // Apply body theme class & overflow-x lock
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-wood');
    document.body.classList.add(`theme-${themeMode}`);
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
  }, [themeMode]);

  // Outer & Container Theme Styles
  const outerBg =
    themeMode === 'light'
      ? 'bg-slate-100 text-slate-900'
      : themeMode === 'dark'
      ? 'bg-[#0B0F17] text-gray-100'
      : 'bg-[#F6F1E9] text-[#2C1E16]';

  const containerBg =
    themeMode === 'light'
      ? 'bg-white border-slate-200'
      : themeMode === 'dark'
      ? 'bg-[#131B2B] border-[#253248]'
      : 'bg-[#FDFBF7] border-[#E6DEC3]';

  return (
    <div className={`min-h-screen ${outerBg} font-sans flex flex-col items-center overflow-x-hidden w-full`}>
      {/* Container auto-fits desktop width comfortably, and goes edge-to-edge on mobile/tablet without side borders */}
      <div className={`w-full max-w-5xl md:max-w-6xl min-h-screen ${containerBg} shadow-xl flex flex-col relative sm:border-x border-transparent overflow-x-hidden transition-colors duration-200 mx-auto`}>
        {/* Top Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 overflow-y-auto overflow-x-hidden w-full">
          {activeTab === 'home' && (
            <HomeView onOpenNewOrder={() => setShowNewOrderModal(true)} />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenNewOrder={() => setShowNewOrderModal(true)}
              onOpenNewProduct={() => setShowNewProductModal(true)}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView
              onOpenNewProduct={() => setShowNewProductModal(true)}
            />
          )}

          {activeTab === 'inventory' && <InventoryView />}

          {activeTab === 'orders' && (
            <OrdersView
              onOpenNewOrder={() => setShowNewOrderModal(true)}
            />
          )}

          {activeTab === 'customers' && <CustomersView />}
        </main>

        {/* Bottom Navigation Bar */}
        <Navigation />

        {/* Modals */}
        {showNewProductModal && (
          <ProductFormModal onClose={() => setShowNewProductModal(false)} />
        )}

        {showNewOrderModal && (
          <NewOrderModal onClose={() => setShowNewOrderModal(false)} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}
