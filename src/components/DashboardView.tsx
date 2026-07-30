import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ShoppingBag,
  AlertTriangle,
  AlertCircle,
  PlusCircle,
  Calculator,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewOrder: () => void;
  onOpenNewProduct: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewOrder,
  onOpenNewProduct,
}) => {
  const { products, orders, setActiveTab, settings } = useApp();

  // Quick Calculator State
  const [calcCost, setCalcCost] = useState<number>(50);
  const [calcCustom, setCalcCustom] = useState<number>(15);
  const [calcPrice, setCalcPrice] = useState<number>(120);

  const totalCost = calcCost + calcCustom;
  const profit = Math.max(0, calcPrice - totalCost);
  const marginPercent = calcPrice > 0 ? (profit / calcPrice) * 100 : 0;
  const isLowMargin = marginPercent < settings.defaultMinMarginPercent;

  // Financial calculations
  const confirmedOrders = orders.filter((o) => o.status !== 'Cancelado' && o.status !== 'Orçamento');
  const totalRevenue = confirmedOrders.reduce((acc, o) => acc + o.total, 0);
  const totalProfit = confirmedOrders.reduce((acc, o) => acc + o.profit, 0);
  const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const pendingOrders = orders.filter(
    (o) => o.status === 'Aguardando Gravação' || o.status === 'Em Produção' || o.status === 'Orçamento'
  );

  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStock);
  const lowMarginProducts = products.filter((p) => {
    const cost = p.costPrice + p.customizationCost;
    if (p.finalPrice <= 0 || cost <= 0) return false;
    const margin = ((p.finalPrice - cost) / p.finalPrice) * 100;
    return margin < (p.lowMarginThreshold || settings.defaultMinMarginPercent);
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-br from-[#7A4B29] to-[#5C381E] rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#2E6F40]/30 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E2C392] bg-black/20 px-2 py-0.5 rounded-md border border-[#9E7348]">
              Visão Geral Financeira
            </span>
            <h2 className="text-xl font-bold mt-1 text-[#FDFBF7]">
              Painel de Gestão
            </h2>
            <p className="text-xs text-[#E8DDCB] mt-0.5">
              Controle de faturamento, margens e pedidos de personalização
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0]/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
            <TrendingUp className="w-6 h-6 text-[#A3E0B2]" />
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/15">
          <button
            onClick={onOpenNewOrder}
            className="py-2 px-3 bg-[#2E6F40] hover:bg-[#245832] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 border border-[#438250]"
          >
            <PlusCircle className="w-4 h-4" />
            Nova Venda Rápida
          </button>
          <button
            onClick={onOpenNewProduct}
            className="py-2 px-3 bg-[#FAF6F0]/15 hover:bg-[#FAF6F0]/25 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/20"
          >
            <PlusCircle className="w-4 h-4 text-[#E2C392]" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* KPI 1: Faturamento */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#E6DEC3] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7A6A58]">
            <span className="text-xs font-semibold">Faturamento Total</span>
            <div className="p-1.5 rounded-lg bg-[#FAF6F0] text-[#7A4B29]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-extrabold text-[#2C1E16]">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-[#2E6F40] font-medium mt-0.5 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> {confirmedOrders.length} vendas confirmadas
            </p>
          </div>
        </div>

        {/* KPI 2: Lucro Bruto */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#E6DEC3] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7A6A58]">
            <span className="text-xs font-semibold">Lucro Bruto</span>
            <div className="p-1.5 rounded-lg bg-[#EAF3EC] text-[#2E6F40]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-extrabold text-[#2E6F40]">
              R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-[#5C4D3E] font-medium mt-0.5">
              Receita líquida após insumos
            </p>
          </div>
        </div>

        {/* KPI 3: Margem Média */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#E6DEC3] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7A6A58]">
            <span className="text-xs font-semibold">Margem Média</span>
            <div className="p-1.5 rounded-lg bg-[#FAF6F0] text-[#7A4B29]">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-extrabold text-[#2C1E16]">
              {averageMargin.toFixed(1)}%
            </div>
            <p className="text-[10px] text-[#7A6A58] mt-0.5">
              Mínima recomendada: {settings.defaultMinMarginPercent}%
            </p>
          </div>
        </div>

        {/* KPI 4: Pedidos Pendentes */}
        <div
          onClick={() => setActiveTab('orders')}
          className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#E6DEC3] flex flex-col justify-between cursor-pointer hover:bg-[#FAF6F0] transition-colors"
        >
          <div className="flex items-center justify-between text-[#7A6A58]">
            <span className="text-xs font-semibold">Em Produção/Gravação</span>
            <div className="p-1.5 rounded-lg bg-[#FFF8E1] text-[#F57F17]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-extrabold text-[#2C1E16] flex items-center justify-between">
              <span>{pendingOrders.length}</span>
              <ArrowRight className="w-4 h-4 text-[#7A4B29]" />
            </div>
            <p className="text-[10px] text-[#F57F17] font-medium mt-0.5">
              Clique para gerenciar
            </p>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner (if any) */}
      {(lowMarginProducts.length > 0 || lowStockProducts.length > 0) && (
        <div className="space-y-2">
          {/* Low Margin Alert */}
          {lowMarginProducts.length > 0 && (
            <div className="bg-[#FFF5F5] border border-[#FEB2B2] rounded-2xl p-3 flex items-start gap-3 shadow-xs">
              <div className="p-2 rounded-xl bg-[#FED7D7] text-[#C53030] shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#9B2C2C]">
                    Alerta de Margem Baixa ({lowMarginProducts.length})
                  </h4>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-[11px] font-bold text-[#C53030] hover:underline"
                  >
                    Ver Produtos
                  </button>
                </div>
                <p className="text-[11px] text-[#742A2A] mt-0.5 line-clamp-1">
                  Ex: {lowMarginProducts[0].name} (Preço: R${lowMarginProducts[0].finalPrice.toFixed(2)}) está com margem reduzida!
                </p>
              </div>
            </div>
          )}

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl p-3 flex items-start gap-3 shadow-xs">
              <div className="p-2 rounded-xl bg-[#FFECB3] text-[#E65100] shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#B71C1C]">
                    Estoque Crítico ({lowStockProducts.length})
                  </h4>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-[11px] font-bold text-[#E65100] hover:underline"
                  >
                    Repor Estoque
                  </button>
                </div>
                <p className="text-[11px] text-[#5D4037] mt-0.5 line-clamp-1">
                  Item: {lowStockProducts[0].name} ({lowStockProducts[0].currentStock} un. restantes, mín. {lowStockProducts[0].minStock})
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Interactive Profit & Margin Simulator */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6DEC3] shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F0E8D9]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FAF6F0] text-[#7A4B29]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#2C1E16]">
                Simulador Rápido de Precificação
              </h3>
              <p className="text-[11px] text-[#7A6A58]">
                Calcule o lucro instantâneo para orçamentos de balcão
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <label className="block text-[10px] font-bold text-[#6C5B4C] mb-1">
              Custo Bruto (R$)
            </label>
            <input
              type="number"
              value={calcCost}
              onChange={(e) => setCalcCost(Number(e.target.value))}
              className="w-full text-xs font-bold px-2 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF] text-[#2C1E16]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#6C5B4C] mb-1">
              Personalização (R$)
            </label>
            <input
              type="number"
              value={calcCustom}
              onChange={(e) => setCalcCustom(Number(e.target.value))}
              className="w-full text-xs font-bold px-2 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF] text-[#2C1E16]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#6C5B4C] mb-1">
              Preço de Venda (R$)
            </label>
            <input
              type="number"
              value={calcPrice}
              onChange={(e) => setCalcPrice(Number(e.target.value))}
              className="w-full text-xs font-bold px-2 py-1.5 rounded-lg bg-white border border-[#2E6F40] text-[#2E6F40]"
            />
          </div>
        </div>

        {/* Calculation Result Row */}
        <div className={`p-3 rounded-xl border flex items-center justify-between ${
          isLowMargin
            ? 'bg-[#FFF5F5] border-[#FEB2B2] text-[#9B2C2C]'
            : 'bg-[#EAF3EC] border-[#A3D9B1] text-[#1E4D2B]'
        }`}>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
              Lucro Estimado ($)
            </div>
            <div className="text-base font-extrabold">
              R$ {profit.toFixed(2)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
              Margem de Lucro (%)
            </div>
            <div className="text-base font-extrabold flex items-center gap-1 justify-end">
              {marginPercent.toFixed(1)}%
              {isLowMargin && <AlertTriangle className="w-4 h-4 text-[#C53030]" />}
            </div>
          </div>
        </div>

        {isLowMargin && (
          <p className="text-[10px] text-[#C53030] font-bold mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Aviso: Margem abaixo da meta de {settings.defaultMinMarginPercent}%. Aumente o preço de venda para garantir lucratividade!
          </p>
        )}
      </div>

      {/* Recent Orders List */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6DEC3] shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F0E8D9]">
          <h3 className="font-bold text-sm text-[#2C1E16] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#7A4B29]" />
            Últimas Vendas & Pedidos
          </h3>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-[#2E6F40] hover:underline flex items-center gap-1"
          >
            Ver Todos ({orders.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {orders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              onClick={() => setActiveTab('orders')}
              className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E8DEC8] hover:border-[#7A4B29] transition-all cursor-pointer flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2C1E16]">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      order.status === 'Entregue'
                        ? 'bg-[#EAF3EC] text-[#2E6F40] border-[#A3D9B1]'
                        : order.status === 'Em Produção' || order.status === 'Aguardando Gravação'
                        ? 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-[#5C4D3E] font-medium truncate mt-0.5">
                  {order.customerName}
                </p>
                <p className="text-[11px] text-[#7A6A58] truncate italic">
                  {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-extrabold text-[#2C1E16]">
                  R$ {order.total.toFixed(2)}
                </div>
                <div className="text-[10px] text-[#2E6F40] font-bold">
                  Lucro R$ {order.profit.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
