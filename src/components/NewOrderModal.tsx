import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getThemeStyles } from '../utils/theme';
import {
  SaleOrderItem,
  PaymentMethod,
  OrderStatus,
} from '../types';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Check,
  DollarSign,
  User,
  Phone,
  Flame,
} from 'lucide-react';

interface NewOrderModalProps {
  onClose: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose }) => {
  const { products, customers, addOrder, settings } = useApp();
  const themeStyles = getThemeStyles(settings.primaryColor);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  // Selected items in order
  const [items, setItems] = useState<SaleOrderItem[]>([]);

  // Item builder fields
  const [builderProductId, setBuilderProductId] = useState(
    products.length > 0 ? products[0].id : ''
  );
  const [builderQty, setBuilderQty] = useState(1);
  const [builderEngraving, setBuilderEngraving] = useState('');

  // Payment & Status
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  const [status, setStatus] = useState<OrderStatus>('Aguardando Gravação');
  const [discount, setDiscount] = useState<number>(0);
  const [customizationNotes, setCustomizationNotes] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleSelectExistingCustomer = (id: string) => {
    setSelectedCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
    }
  };

  const handleAddItem = () => {
    const prod = products.find((p) => p.id === builderProductId);
    if (!prod || builderQty <= 0) return;

    const totalUnitCost = prod.costPrice + prod.customizationCost;

    const newItem: SaleOrderItem = {
      productId: prod.id,
      productName: prod.name,
      productImage: prod.mainImage,
      unitCost: totalUnitCost,
      unitPrice: prod.finalPrice,
      quantity: builderQty,
      engravingText: builderEngraving,
    };

    setItems([...items, newItem]);
    setBuilderEngraving('');
    setBuilderQty(1);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
  const totalCost = items.reduce(
    (acc, item) => acc + item.unitCost * item.quantity,
    0
  );
  const total = Math.max(0, subtotal - discount);
  const profit = Math.max(0, total - totalCost);
  const profitMarginPercent = total > 0 ? (profit / total) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || items.length === 0) {
      alert('Por favor, informe o nome do cliente e adicione ao menos um produto.');
      return;
    }

    addOrder({
      customerName,
      customerPhone,
      items,
      subtotal,
      discount: Number(discount) || 0,
      total,
      totalCost,
      profit,
      profitMarginPercent,
      paymentMethod,
      status,
      customizationNotes,
      deliveryAddress,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-[#FAF6F0] text-[#2C1E16] w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-[#E0D5C3] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#2E6F40] text-white">
              <ShoppingCart className="w-5 h-5 text-[#E2C392]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C1E16]">
                Lançar Novo Pedido / Venda
              </h3>
              <p className="text-[11px] text-[#7A6A58]">
                Registre cliente, gravação laser e meio de pagamento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 font-bold text-lg px-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Selection */}
          <div className="p-3 bg-white rounded-xl border border-[#E6DEC3] space-y-2">
            <label className="block text-xs font-bold text-[#2C1E16] flex items-center gap-1">
              <User className="w-4 h-4 text-[#7A4B29]" /> Informações do Cliente
            </label>

            {customers.length > 0 && (
              <div>
                <span className="text-[10px] text-gray-500 block mb-1">
                  Selecionar Cliente Cadastrado (ou digite abaixo)
                </span>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleSelectExistingCustomer(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF]"
                >
                  <option value="">-- Novo / Cliente Avulso --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  placeholder="Nome do Cliente *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#DCD1BF]"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="WhatsApp / Telefone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#DCD1BF]"
                />
              </div>
            </div>
          </div>

          {/* Add Item Builder */}
          <div className="p-3 bg-[#FAF6F0] border border-[#E0D5C3] rounded-xl space-y-2">
            <label className="block text-xs font-bold text-[#7A4B29]">
              Adicionar Produtos ao Pedido
            </label>

            <div className="space-y-2">
              <div>
                <select
                  value={builderProductId}
                  onChange={(e) => setBuilderProductId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#DCD1BF]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - R$ {p.finalPrice.toFixed(2)} (Estoque: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-gray-600 block mb-0.5">Qtd.</span>
                  <input
                    type="number"
                    min="1"
                    value={builderQty}
                    onChange={(e) => setBuilderQty(Number(e.target.value))}
                    className="w-full text-xs font-bold px-2 py-1.5 rounded-lg bg-white border border-[#DCD1BF]"
                  />
                </div>

                <div className="col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-1.5 bg-[#7A4B29] hover:bg-[#5C381E] text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Incluir Item
                  </button>
                </div>
              </div>

              {/* Engraving text for builder item */}
              <div>
                <input
                  type="text"
                  placeholder="✒️ Texto/Desenho para Gravação Laser neste item (opcional)..."
                  value={builderEngraving}
                  onChange={(e) => setBuilderEngraving(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-[#DCD1BF]"
                />
              </div>
            </div>

            {/* Added Items List */}
            {items.length > 0 && (
              <div className="pt-2 border-t border-[#E8DEC8] space-y-1.5">
                <span className="text-[11px] font-bold text-[#2C1E16] block">
                  Itens no Carrinho ({items.length}):
                </span>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-white rounded-lg border border-[#DCD1BF] flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-[#2C1E16] block truncate">
                        {item.quantity}x {item.productName}
                      </span>
                      {item.engravingText && (
                        <span className="text-[10px] text-[#7A4B29] italic block truncate">
                          Gravar: "{item.engravingText}"
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-extrabold text-[#2E6F40]">
                        R$ {(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment & Status Settings */}
          <div className="p-3 bg-white rounded-xl border border-[#E6DEC3] space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Meio de Pagamento
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF] font-semibold"
                >
                  <option value="Pix">Pix (Instântaneo)</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro">Dinheiro Espécie</option>
                  <option value="A Prazo / Fiado">A Prazo / Fiado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Status do Pedido
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF] font-semibold"
                >
                  <option value="Orçamento">Orçamento</option>
                  <option value="Aguardando Gravação">Aguardando Gravação</option>
                  <option value="Em Produção">Em Produção</option>
                  <option value="Pronto para Envio">Pronto para Envio</option>
                  <option value="Entregue">Entregue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Desconto Concedido (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Endereço / Cidade
                </label>
                <input
                  type="text"
                  placeholder="Ex: Caxias do Sul / Retirada"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                Observações de Personalização / Embalagem
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Embalagem de presente com fita verde mate e saquinho de veludo."
                value={customizationNotes}
                onChange={(e) => setCustomizationNotes(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF]"
              />
            </div>
          </div>

          {/* Totals & Projected Profit Summary */}
          <div className="p-3 bg-[#EAF3EC] border border-[#A3D9B1] rounded-xl flex items-center justify-between text-xs text-[#1E4D2B]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                Total do Pedido
              </span>
              <span className="text-base font-extrabold text-[#2E6F40]">
                R$ {total.toFixed(2)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                Lucro Bruto Calculado
              </span>
              <span className="text-base font-extrabold text-[#2E6F40]">
                R$ {profit.toFixed(2)} ({profitMarginPercent.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-200 text-gray-800 font-bold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 ${themeStyles.bgPrimary} ${themeStyles.bgHover} text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer`}
            >
              <Check className="w-4 h-4" /> Confirma Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
