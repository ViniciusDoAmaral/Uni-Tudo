import React, { useState } from 'react';
import { SaleOrder } from '../types';
import { useApp } from '../context/AppContext';
import { MessageSquare, Copy, Check, Printer, Share2, Flame } from 'lucide-react';

interface OrderReceiptModalProps {
  order: SaleOrder;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  onClose,
}) => {
  const { settings } = useApp();
  const [copied, setCopied] = useState(false);

  // Build clean WhatsApp message template
  const generateWhatsAppText = () => {
    let msg = `*${settings.businessName.toUpperCase()}*\n`;
    msg += `📄 *Comprovante do Pedido ${order.orderNumber}*\n`;
    msg += `-----------------------------------\n`;
    msg += `👤 *Cliente:* ${order.customerName}\n`;
    msg += `📱 *WhatsApp:* ${order.customerPhone}\n`;
    msg += `📅 *Data:* ${new Date(order.createdAt).toLocaleDateString('pt-BR')}\n`;
    msg += `-----------------------------------\n\n`;
    msg += `🛒 *ITENS DO PEDIDO:*\n`;

    order.items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.quantity}x ${item.productName}*\n`;
      msg += `   Valor Unit.: R$ ${item.unitPrice.toFixed(2)}\n`;
      if (item.engravingText) {
        msg += `   ✒️ *Gravação Laser:* ${item.engravingText}\n`;
      }
    });

    msg += `\n-----------------------------------\n`;
    if (order.discount > 0) {
      msg += `Subtotal: R$ ${order.subtotal.toFixed(2)}\n`;
      msg += `Desconto: R$ ${order.discount.toFixed(2)}\n`;
    }
    msg += `💰 *TOTAL DO PEDIDO:* R$ ${order.total.toFixed(2)}\n`;
    msg += `💳 *Forma de Pagamento:* ${order.paymentMethod}\n`;
    msg += `📌 *Status Atual:* ${order.status}\n`;

    if (order.customizationNotes) {
      msg += `\n📝 *Observações:* ${order.customizationNotes}\n`;
    }

    msg += `\nAgradecemos a preferência! Dúvidas? Fale conosco!`;
    return msg;
  };

  const handleCopyText = () => {
    const text = generateWhatsAppText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = order.customerPhone.replace(/\D/g, '');
    const text = encodeURIComponent(generateWhatsAppText());
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-[#FAF6F0] text-[#2C1E16] w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-[#E0D5C3] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#2E6F40] text-white">
              <Flame className="w-5 h-5 text-[#E2C392]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C1E16]">
                Recibo Digital
              </h3>
              <p className="text-[11px] text-[#7A6A58]">
                {order.orderNumber} - {order.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg px-2"
          >
            ✕
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="bg-white p-4 rounded-xl border border-[#E6DEC3] shadow-xs space-y-3 font-sans text-xs">
          <div className="text-center pb-2 border-b border-[#F0E8D9]">
            <h4 className="font-bold text-sm text-[#2C1E16]">
              {settings.businessName}
            </h4>
            <span className="text-[10px] text-gray-500 block">
              Artigos Gaúchos & Cutelaria Personalizada
            </span>
            <div className="mt-1 text-[11px] font-extrabold text-[#7A4B29] bg-[#FAF6F0] inline-block px-2 py-0.5 rounded-md border border-[#E6DEC3]">
              PEDIDO {order.orderNumber}
            </div>
          </div>

          <div className="space-y-1 text-[11px]">
            <p>
              <strong>Cliente:</strong> {order.customerName}
            </p>
            <p>
              <strong>Telefone:</strong> {order.customerPhone}
            </p>
            <p>
              <strong>Data:</strong>{' '}
              {new Date(order.createdAt).toLocaleDateString('pt-BR')}
            </p>
            <p>
              <strong>Pagamento:</strong> {order.paymentMethod}
            </p>
            <p className="flex items-center gap-1">
              <strong>Status:</strong>{' '}
              <span className="px-2 py-0.2 bg-[#EAF3EC] text-[#2E6F40] rounded-full font-bold text-[10px]">
                {order.status}
              </span>
            </p>
          </div>

          <div className="pt-2 border-t border-[#F0E8D9] space-y-2">
            <span className="font-bold text-xs text-[#2C1E16] block">
              Itens Solicitados:
            </span>

            {order.items.map((item, index) => (
              <div
                key={index}
                className="p-2 rounded-lg bg-[#FAF6F0] border border-[#E8DEC8] space-y-1"
              >
                <div className="flex justify-between font-bold text-xs text-[#2C1E16]">
                  <span>
                    {item.quantity}x {item.productName}
                  </span>
                  <span>R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>

                {item.engravingText && (
                  <p className="text-[10px] text-[#7A4B29] font-medium bg-white p-1 rounded border border-[#E6DEC3] leading-tight">
                    ✒️ <strong>Gravação:</strong> {item.engravingText}
                  </p>
                )}
              </div>
            ))}
          </div>

          {order.customizationNotes && (
            <div className="p-2 bg-[#FFFDF5] border border-[#FFE082] rounded-lg text-[10px] text-[#5D4037]">
              <strong>Instruções Especiais:</strong> {order.customizationNotes}
            </div>
          )}

          <div className="pt-2 border-t border-[#F0E8D9] space-y-1 text-right">
            {order.discount > 0 && (
              <p className="text-[10px] text-gray-500">
                Desconto Concedido: R$ {order.discount.toFixed(2)}
              </p>
            )}
            <div className="text-base font-extrabold text-[#2C1E16]">
              Total Pago: R$ {order.total.toFixed(2)}
            </div>
            <div className="text-[10px] text-[#2E6F40] font-bold">
              Lucro do Pedido: R$ {order.profit.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-2.5 bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Enviar Comprovante via WhatsApp
          </button>

          <button
            onClick={handleCopyText}
            className="w-full py-2 bg-white hover:bg-[#FAF6F0] text-[#7A4B29] font-bold text-xs rounded-xl border border-[#DCD1BF] transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#2E6F40]" /> Texto Copiado para Área de Transferência!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copiar Texto do Recibo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
