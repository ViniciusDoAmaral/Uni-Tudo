import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import {
  Users,
  Plus,
  Search,
  MessageSquare,
  MapPin,
  ShoppingBag,
  DollarSign,
  Phone,
  User,
  Check,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, orders, addCustomer } = useApp();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomer({
      name,
      phone,
      city,
      notes,
    });

    setShowAddModal(false);
    setName('');
    setPhone('');
    setCity('');
    setNotes('');
  };

  const handleOpenWhatsApp = (phoneStr: string, nameStr: string) => {
    const cleanPhone = phoneStr.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Olá ${nameStr}, tudo bem? Aqui é da Uni Tudo Cutelaria e Artigos Personalizados! Como podemos te ajudar hoje?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#2C1E16] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#7A4B29]" />
            Cadastro de Clientes
          </h2>
          <p className="text-xs text-[#7A6A58]">
            {filteredCustomers.length} clientes cadastrados
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-3 bg-[#2E6F40] hover:bg-[#245832] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome, telefone ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16]"
        />
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#E6DEC3] text-center space-y-2">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs font-bold text-[#6C5B4C]">
              Nenhum cliente encontrado.
            </p>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const customerOrders = orders.filter(
              (o) =>
                o.customerName.toLowerCase() === cust.name.toLowerCase() ||
                o.customerPhone.replace(/\D/g, '') === cust.phone.replace(/\D/g, '')
            );
            const totalSpent = customerOrders.reduce((acc, o) => acc + o.total, 0);

            return (
              <div
                key={cust.id}
                className="bg-white rounded-2xl border border-[#E6DEC3] p-4 shadow-xs hover:border-[#7A4B29] transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#2C1E16]">
                      {cust.name}
                    </h3>
                    <p className="text-xs text-[#7A6A58] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-[#2E6F40]" /> {cust.phone}
                    </p>
                    {cust.city && (
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#7A4B29]" /> {cust.city}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenWhatsApp(cust.phone, cust.name)}
                    className="p-2 bg-[#25D366] text-white rounded-xl shadow-xs hover:bg-[#1EBE5A] transition-colors"
                    title="Enviar mensagem no WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                {cust.notes && (
                  <p className="text-[11px] text-[#5C4D3E] bg-[#FAF6F0] p-2 rounded-lg border border-[#E6DEC3] italic">
                    "{cust.notes}"
                  </p>
                )}

                {/* Customer Stats Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[#F0E8D9] text-xs">
                  <span className="text-[#7A6A58] flex items-center gap-1 font-semibold">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#7A4B29]" />{' '}
                    {customerOrders.length || cust.totalOrders} pedidos realizados
                  </span>
                  <span className="font-extrabold text-[#2E6F40]">
                    Total: R$ {totalSpent > 0 ? totalSpent.toFixed(2) : cust.totalSpent.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] text-[#2C1E16] w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-[#E0D5C3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] mb-4">
              <h3 className="font-bold text-base text-[#2C1E16]">
                Cadastrar Novo Cliente
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Rodrigo Medeiros"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="Ex: (54) 99823-4411"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Cidade / Estado
                </label>
                <input
                  type="text"
                  placeholder="Ex: Caxias do Sul - RS"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Observações / Preferências
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Prefere gravações de brasões gaúchos."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl bg-white border border-[#DCD1BF]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#2E6F40] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" /> Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
