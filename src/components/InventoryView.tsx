import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MovementType, MovementReason } from '../types';
import {
  Warehouse,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  PlusCircle,
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { products, movements, addInventoryMovement } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [movementType, setMovementType] = useState<MovementType>('in');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<MovementReason>('Compra de Lote');
  const [notes, setNotes] = useState<string>('');
  const [showMovementModal, setShowMovementModal] = useState(false);

  const [search, setSearch] = useState('');
  const [filterCriticalOnly, setFilterCriticalOnly] = useState(false);

  // Filter products for inventory grid
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    if (filterCriticalOnly && p.currentStock > p.minStock) return false;
    return matchesSearch;
  });

  const lowStockCount = products.filter((p) => p.currentStock <= p.minStock).length;

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) return;

    addInventoryMovement(selectedProductId, movementType, quantity, reason, notes);

    setShowMovementModal(false);
    setSelectedProductId('');
    setQuantity(1);
    setNotes('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#2C1E16] flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-[#7A4B29]" />
            Controle de Estoque
          </h2>
          <p className="text-xs text-[#7A6A58]">
            Entradas, saídas e alertas de estoque mínimo
          </p>
        </div>

        <button
          onClick={() => {
            if (products.length > 0) setSelectedProductId(products[0].id);
            setShowMovementModal(true);
          }}
          className="py-2 px-3 bg-[#2E6F40] hover:bg-[#245832] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Lançar Movimentação
        </button>
      </div>

      {/* Low Stock Alert Header Banner */}
      {lowStockCount > 0 && (
        <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFECB3] text-[#E65100]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#B71C1C]">
                {lowStockCount} produtos com estoque crítico!
              </h4>
              <p className="text-[11px] text-[#5D4037]">
                Reponha o estoque para evitar atrasos na produção de gravações.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterCriticalOnly(!filterCriticalOnly)}
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
              filterCriticalOnly
                ? 'bg-[#E65100] text-white border-[#B71C1C]'
                : 'bg-white text-[#E65100] border-[#FFE082]'
            }`}
          >
            {filterCriticalOnly ? 'Ver Todos' : 'Filtrar Críticos'}
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar no estoque por nome ou SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16]"
        />
      </div>

      {/* Current Inventory Stock List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-[#6C5B4C] uppercase tracking-wider">
          Posição de Estoque Atual
        </h3>

        {filteredProducts.map((product) => {
          const isCritical = product.currentStock <= product.minStock;

          return (
            <div
              key={product.id}
              className={`bg-white p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-xs ${
                isCritical ? 'border-[#FFE082] bg-[#FFFDF5]' : 'border-[#E6DEC3]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#DCD1BF] shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-500 font-mono block">
                    {product.sku}
                  </span>
                  <h4 className="font-bold text-xs text-[#2C1E16] truncate">
                    {product.name}
                  </h4>
                  <span className="text-[10px] text-[#7A6A58] block">
                    Estoque Mínimo Configurado: {product.minStock} un.
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <span
                    className={`text-sm font-extrabold px-2.5 py-0.5 rounded-lg border ${
                      isCritical
                        ? 'bg-[#FFECB3] text-[#B71C1C] border-[#F57C00]'
                        : 'bg-[#EAF3EC] text-[#2E6F40] border-[#A3D9B1]'
                    }`}
                  >
                    {product.currentStock} un.
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedProductId(product.id);
                    setShowMovementModal(true);
                  }}
                  className="text-[10px] font-bold text-[#7A4B29] hover:underline mt-1 block"
                >
                  + Movimentar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Movement History */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6DEC3] shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-[#2C1E16] flex items-center gap-2 border-b border-[#F0E8D9] pb-2">
          <Clock className="w-4 h-4 text-[#7A4B29]" />
          Histórico de Entradas e Saídas
        </h3>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {movements.length === 0 ? (
            <p className="text-xs text-gray-500 italic text-center py-4">
              Nenhuma movimentação registrada ainda.
            </p>
          ) : (
            movements.map((mov) => (
              <div
                key={mov.id}
                className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8DEC8] flex items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      mov.type === 'in'
                        ? 'bg-[#EAF3EC] text-[#2E6F40]'
                        : mov.type === 'out'
                        ? 'bg-[#FFF5F5] text-[#C53030]'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {mov.type === 'in' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : mov.type === 'out' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#2C1E16] block truncate">
                      {mov.productName}
                    </span>
                    <span className="text-[10px] text-[#7A6A58] block">
                      Motivo: <strong>{mov.reason}</strong> {mov.notes && `(${mov.notes})`}
                    </span>
                    <span className="text-[9px] text-gray-400">
                      {new Date(mov.date).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(mov.date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div
                  className={`text-xs font-extrabold shrink-0 ${
                    mov.type === 'in'
                      ? 'text-[#2E6F40]'
                      : mov.type === 'out'
                      ? 'text-[#C53030]'
                      : 'text-blue-700'
                  }`}
                >
                  {mov.type === 'in' ? '+' : mov.type === 'out' ? '-' : ''}
                  {mov.quantity} un.
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Movement Modal */}
      {showMovementModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] text-[#2C1E16] w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-[#E0D5C3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] mb-4">
              <h3 className="font-bold text-base text-[#2C1E16]">
                Registrar Movimentação de Estoque
              </h3>
              <button
                onClick={() => setShowMovementModal(false)}
                className="text-gray-400 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMovement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Produto
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Atual: {p.currentStock} un)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Tipo de Movimentação
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMovementType('in');
                      setReason('Compra de Lote');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      movementType === 'in'
                        ? 'bg-[#2E6F40] text-white border-[#235832]'
                        : 'bg-white text-gray-700 border-[#DCD1BF]'
                    }`}
                  >
                    + Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMovementType('out');
                      setReason('Avaria / Perda na Gravação');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      movementType === 'out'
                        ? 'bg-[#C53030] text-white border-[#9B2C2C]'
                        : 'bg-white text-gray-700 border-[#DCD1BF]'
                    }`}
                  >
                    - Saída
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMovementType('adjustment');
                      setReason('Ajuste de Inventário');
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      movementType === 'adjustment'
                        ? 'bg-blue-700 text-white border-blue-800'
                        : 'bg-white text-gray-700 border-[#DCD1BF]'
                    }`}
                  >
                    = Ajuste
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                    Motivo
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as MovementReason)}
                    className="w-full text-xs px-2 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                  >
                    <option value="Compra de Lote">Compra de Lote</option>
                    <option value="Venda de Pedido">Venda de Pedido</option>
                    <option value="Avaria / Perda na Gravação">Avaria na Gravação</option>
                    <option value="Ajuste de Inventário">Ajuste de Inventário</option>
                    <option value="Brinde / Amostra">Brinde / Amostra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Observações / Detalhes
                </label>
                <input
                  type="text"
                  placeholder="Ex: Nota fiscal #4820 da serraria"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#2E6F40] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
