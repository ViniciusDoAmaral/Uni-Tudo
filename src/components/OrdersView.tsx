import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SaleOrder, OrderStatus } from '../types';
import { getThemeStyles } from '../utils/theme';
import {
  ShoppingCart,
  Plus,
  Search,
  MessageSquare,
  Trash2,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { OrderReceiptModal } from './OrderReceiptModal';

const STATUS_OPTIONS: ('Todos' | OrderStatus)[] = [
  'Todos',
  'Orçamento',
  'Aguardando Gravação',
  'Em Produção',
  'Pronto para Envio',
  'Entregue',
  'Cancelado',
];

export const OrdersView: React.FC<{ onOpenNewOrder: () => void }> = ({
  onOpenNewOrder,
}) => {
  const { orders, updateOrderStatus, deleteOrder, settings } = useApp();
  const themeStyles = getThemeStyles(settings.primaryColor);

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | OrderStatus>('Todos');
  const [receiptTargetOrder, setReceiptTargetOrder] = useState<SaleOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === 'Todos' || o.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#2C1E16] flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#7A4B29]" />
            Gestão de Pedidos & Vendas
          </h2>
          <p className="text-xs text-[#7A6A58]">
            {filteredOrders.length} pedidos em exibição
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className={`py-2 px-3 ${themeStyles.bgPrimary} ${themeStyles.bgHover} text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer`}
        >
          <Plus className="w-4 h-4" />
          Novo Pedido
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número do pedido, cliente ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`text-[11px] font-bold px-3 py-1 rounded-xl whitespace-nowrap transition-all border ${
                selectedStatus === st
                  ? 'bg-[#2E6F40] text-white border-[#235832] shadow-xs'
                  : 'bg-white text-[#6C5B4C] border-[#E6DEC3] hover:bg-[#FAF6F0]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#E6DEC3] text-center space-y-2">
            <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs font-bold text-[#6C5B4C]">
              Nenhum pedido encontrado com os critérios digitados.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#E6DEC3] p-4 shadow-xs hover:border-[#7A4B29] transition-all space-y-3"
            >
              {/* Order Header Row */}
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E8D9]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[#2C1E16]">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#5C4D3E]">
                    {order.customerName} ({order.customerPhone})
                  </h4>
                </div>

                <div className="text-right">
                  {/* Status Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as OrderStatus)
                    }
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                      order.status === 'Entregue'
                        ? 'bg-[#EAF3EC] text-[#2E6F40] border-[#A3D9B1]'
                        : order.status === 'Em Produção' ||
                          order.status === 'Aguardando Gravação'
                        ? 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    <option value="Orçamento">Orçamento</option>
                    <option value="Aguardando Gravação">Aguardando Gravação</option>
                    <option value="Em Produção">Em Produção</option>
                    <option value="Pronto para Envio">Pronto para Envio</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Items List inside card */}
              <div className="space-y-1.5">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-[#FAF6F0] border border-[#E8DEC8] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-[#2C1E16] block truncate">
                        {item.quantity}x {item.productName}
                      </span>
                      {item.engravingText && (
                        <span className="text-[10px] text-[#7A4B29] font-medium block truncate">
                          ✒️ Gravar: "{item.engravingText}"
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-[#2C1E16] shrink-0">
                      R$ {(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer & Profit Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F0E8D9] text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 block">
                    Pagamento: <strong>{order.paymentMethod}</strong>
                  </span>
                  <span className="text-[10px] text-[#2E6F40] font-bold block">
                    Lucro do Pedido: R$ {order.profit.toFixed(2)} ({order.profitMarginPercent.toFixed(1)}%)
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#2C1E16]">
                    R$ {order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F0E8D9]">
                <button
                  onClick={() => setReceiptTargetOrder(order)}
                  className="py-1.5 px-3 bg-[#FAF6F0] hover:bg-[#EAF3EC] text-[#2E6F40] font-bold text-xs rounded-xl border border-[#DCD1BF] flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Recibo WhatsApp
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Deseja excluir o pedido ${order.orderNumber}?`)) {
                      deleteOrder(order.id);
                    }
                  }}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir pedido"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Receipt Modal */}
      {receiptTargetOrder && (
        <OrderReceiptModal
          order={receiptTargetOrder}
          onClose={() => setReceiptTargetOrder(null)}
        />
      )}
    </div>
  );
};
