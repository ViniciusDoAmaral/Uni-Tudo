import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import { getThemeStyles } from '../utils/theme';
import {
  Users,
  Plus,
  Search,
  MessageSquare,
  MapPin,
  ShoppingBag,
  Phone,
  User,
  Check,
  Edit,
  Trash2,
  Mail,
  Home,
  Image,
  AlertTriangle,
  X,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, orders, addCustomer, updateCustomer, deleteCustomer, settings } = useApp();
  const themeStyles = getThemeStyles(settings.primaryColor);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase())) ||
      (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setAddress('');
    setAvatarUrl('');
    setNotes('');
    setShowModal(true);
  };

  const handleOpenEditModal = (cust: Customer) => {
    setEditingCustomer(cust);
    setName(cust.name || '');
    setPhone(cust.phone || '');
    setEmail(cust.email || '');
    setCity(cust.city || '');
    setAddress(cust.address || '');
    setAvatarUrl(cust.avatarUrl || '');
    setNotes(cust.notes || '');
    setShowModal(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name,
        phone,
        email,
        city,
        address,
        avatarUrl,
        notes,
      });
    } else {
      addCustomer({
        name,
        phone,
        email,
        city,
        address,
        avatarUrl,
        notes,
      });
    }

    setShowModal(false);
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setAddress('');
    setAvatarUrl('');
    setNotes('');
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
    }
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
            {filteredCustomers.length} cliente(s) encontrado(s)
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className={`py-2 px-3 ${themeStyles.bgPrimary} ${themeStyles.bgHover} text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer`}
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
          placeholder="Buscar por nome, telefone, e-mail, cidade ou endereço..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16]"
        />
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#E6DEC3] text-center space-y-2 col-span-full">
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
                (cust.phone && o.customerPhone.replace(/\D/g, '') === cust.phone.replace(/\D/g, ''))
            );
            const totalSpent = customerOrders.reduce((acc, o) => acc + o.total, 0);

            return (
              <div
                key={cust.id}
                className="bg-white rounded-2xl border border-[#E6DEC3] p-4 shadow-xs hover:border-[#7A4B29] transition-all space-y-3 relative group"
              >
                {/* Header Slot */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar / Imagem do cliente */}
                    {cust.avatarUrl ? (
                      <img
                        src={cust.avatarUrl}
                        alt={cust.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#E6DEC3] shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full ${themeStyles.bgLight} ${themeStyles.textPrimary} border border-[#DCD1BF] flex items-center justify-center font-bold text-base shrink-0 shadow-xs`}>
                        {cust.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-[#2C1E16] truncate">
                        {cust.name}
                      </h3>
                      {cust.phone && (
                        <p className="text-xs text-[#7A6A58] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-[#2E6F40] shrink-0" /> {cust.phone}
                        </p>
                      )}
                      {cust.email && (
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                          <Mail className="w-3 h-3 text-[#7A4B29] shrink-0" /> {cust.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Slot (WhatsApp, Edit, Delete) */}
                  <div className="flex items-center gap-1 shrink-0">
                    {cust.phone && (
                      <button
                        onClick={() => handleOpenWhatsApp(cust.phone, cust.name)}
                        className="p-1.5 bg-[#25D366] text-white rounded-xl shadow-xs hover:bg-[#1EBE5A] transition-colors cursor-pointer"
                        title="Enviar mensagem no WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEditModal(cust)}
                      className="p-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
                      title="Editar cliente"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCustomerToDelete(cust)}
                      className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl transition-colors cursor-pointer"
                      title="Excluir cliente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Additional Info: City & Delivery Address */}
                {(cust.city || cust.address) && (
                  <div className="bg-[#FAF6F0] p-2.5 rounded-xl border border-[#E6DEC3] text-[11px] text-[#5C4D3E] space-y-1">
                    {cust.city && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#7A4B29] shrink-0" />
                        <span><strong>Cidade:</strong> {cust.city}</span>
                      </div>
                    )}
                    {cust.address && (
                      <div className="flex items-start gap-1.5">
                        <Home className="w-3.5 h-3.5 text-[#2E6F40] shrink-0 mt-0.5" />
                        <span><strong>Entrega:</strong> {cust.address}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
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

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF6F0] text-[#2C1E16] w-full max-w-md rounded-2xl p-5 shadow-2xl border border-[#E0D5C3] my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] mb-4">
              <h3 className="font-bold text-base text-[#2C1E16] flex items-center gap-2">
                <User className="w-5 h-5 text-[#7A4B29]" />
                {editingCustomer ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="Ex: cliente@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    Localização para Entrega
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rua das Flores, 123 - Bairro Centro"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Imagem / Foto do Cliente (URL)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                  />
                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt="Preview"
                      className="w-9 h-9 rounded-full object-cover border border-[#DCD1BF] shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                  Observações / Preferências
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Prefere gravações de brasões gaúchos, entrega à tarde."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl bg-white border border-[#DCD1BF]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 ${themeStyles.bgPrimary} ${themeStyles.bgHover} text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1 cursor-pointer`}
                >
                  <Check className="w-4 h-4" />
                  {editingCustomer ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#2C1E16] w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900">
                Excluir Cliente
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Tem certeza que deseja excluir o cliente <strong>{customerToDelete.name}</strong>? Esta ação removerá o cadastro do cliente do sistema.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCustomerToDelete(null)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
