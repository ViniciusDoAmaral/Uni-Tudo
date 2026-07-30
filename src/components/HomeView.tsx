import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getThemeStyles } from '../utils/theme';
import {
  Sparkles,
  MessageCircle,
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  Camera,
  Upload,
  RotateCcw,
  CheckCircle2,
  Flame,
  Award,
  Heart,
  Plus,
  ArrowRight,
  ShieldCheck,
  Link as LinkIcon,
  X,
} from 'lucide-react';

interface HomeViewProps {
  onOpenNewOrder: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenNewOrder }) => {
  const { settings, updateSettings, setActiveTab, products } = useApp();
  const themeStyles = getThemeStyles(settings.primaryColor);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState(settings.storeBannerUrl || '');
  const [previewImage, setPreviewImage] = useState<string | null>(settings.storeBannerUrl || null);

  // Handle File Upload from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setImageUrlInput(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeBannerUrl: previewImage || undefined,
    });
    setShowImageModal(false);
  };

  const handleResetBanner = () => {
    setPreviewImage(null);
    setImageUrlInput('');
    updateSettings({
      storeBannerUrl: undefined,
    });
    setShowImageModal(false);
  };

  const whatsappPhoneFormatted = '(51) 98294-0234';
  const whatsappClean = '5551982940234';

  return (
    <div className="space-y-4 pb-20">
      {/* BANNER / LOGO DISPLAY SECTION */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1C120C] via-[#2C1E16] to-[#0D1810] border border-[#3D2B20] shadow-lg text-[#FAF6F0]">
        {settings.storeBannerUrl ? (
          /* Custom Banner Image uploaded by user */
          <div className="relative w-full min-h-[220px] max-h-[320px] bg-black/40 flex items-center justify-center overflow-hidden">
            <img
              src={settings.storeBannerUrl}
              alt="Logo / Banner da Loja Uni Tudo"
              className="w-full h-auto object-contain max-h-[320px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
          </div>
        ) : (
          /* Default Brand Banner Representation matching user photo */
          <div className="p-4 sm:p-5 relative overflow-hidden">
            {/* Background Accent Gradients */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#2E6F40]/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#7A4B29]/30 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3 text-center">
              {/* Brand Header */}
              <div className="inline-flex items-center justify-center gap-2 bg-[#FAF6F0]/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-200 tracking-wider uppercase">
                  Personalize • Presenteie • Surpreenda
                </span>
              </div>

              {/* Logo Title */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-white to-emerald-200 bg-clip-text text-transparent drop-shadow-sm font-sans">
                  UNI TUDO
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#E2C392] tracking-wide">
                  PRODUTOS PERSONALIZADOS E ARTIGOS PARA CASA
                </p>
                <div className="inline-block bg-[#E53935] text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-xs uppercase tracking-wider mt-1">
                  Do seu jeito, do seu estilo!
                </div>
              </div>

              {/* Badges bar */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[10px] text-[#D8C9B8]">
                <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Qualidade
                </span>
                <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Criatividade
                </span>
                <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Personalização
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BUTTON TO REPLACE / CHANGE STORE LOGO IMAGE */}
        <div className="p-3 bg-[#241710]/95 backdrop-blur-md border-t border-[#3D2B20] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <p className="text-[11px] text-[#CBBBA8] truncate">
              {settings.storeBannerUrl ? 'Logo da loja carregada' : 'Logo padrão ativa'}
            </p>
          </div>

          <button
            onClick={() => {
              setPreviewImage(settings.storeBannerUrl || null);
              setImageUrlInput(settings.storeBannerUrl || '');
              setShowImageModal(true);
            }}
            className="py-1.5 px-3 bg-[#7A4B29] hover:bg-[#8C5A32] text-white text-xs font-bold rounded-xl border border-[#9C6A42] shadow-sm flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
          >
            <Camera className="w-3.5 h-3.5 text-amber-200" />
            <span>Substituir Logo</span>
          </button>
        </div>
      </div>

      {/* DIRECT WHATSAPP ORDER CALL TO ACTION */}
      <a
        href={`https://wa.me/${whatsappClean}?text=Ol%C3%A1%21%20Gostaria%20de%20fazer%20um%20or%C3%A7amento%20de%20produto%20personalizado.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-3.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-2xl shadow-md border border-emerald-400/40 flex items-center justify-between hover:brightness-105 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100 block">
              Atendimento Direto WhatsApp
            </span>
            <span className="text-sm font-extrabold block">
              Tratar no Fone: {whatsappPhoneFormatted}
            </span>
          </div>
        </div>
        <div className="bg-white text-[#128C7E] px-2.5 py-1 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1">
          Chamar <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </a>

      {/* QUICK ERP NAVIGATION SHORTCUTS */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-[#7A6A58] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#7A4B29]" /> Atalhos do Sistema ERP
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Dashboard Shortcut */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`p-3.5 rounded-2xl ${themeStyles.headerBg} text-white shadow-sm border border-white/20 flex flex-col items-start gap-2 hover:brightness-105 transition-all text-left cursor-pointer`}
          >
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold block">Painel de Gestão</span>
              <span className="text-[10px] text-white/80 leading-tight block">
                Faturamento, lucros e relatórios
              </span>
            </div>
          </button>

          {/* New Order Shortcut */}
          <button
            onClick={onOpenNewOrder}
            className={`p-3.5 rounded-2xl ${themeStyles.bgPrimary} ${themeStyles.bgHover} text-white shadow-sm border border-white/20 flex flex-col items-start gap-2 transition-all text-left cursor-pointer`}
          >
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <Plus className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-xs font-bold block">Novo Pedido</span>
              <span className="text-[10px] text-amber-100/80 leading-tight block">
                Criar venda ou orçamento
              </span>
            </div>
          </button>

          {/* Products Shortcut */}
          <button
            onClick={() => setActiveTab('products')}
            className="p-3 bg-white rounded-2xl border border-[#E6DEC3] text-[#2C1E16] flex items-center gap-2.5 hover:bg-[#FAF6F0] transition-colors text-left"
          >
            <div className="p-2 rounded-xl bg-[#FAF6F0] text-[#7A4B29] border border-[#E6DEC3]">
              <Package className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">Produtos</span>
              <span className="text-[10px] text-gray-500 block truncate">
                {products.length} cadastrados
              </span>
            </div>
          </button>

          {/* Inventory Shortcut */}
          <button
            onClick={() => setActiveTab('inventory')}
            className="p-3 bg-white rounded-2xl border border-[#E6DEC3] text-[#2C1E16] flex items-center gap-2.5 hover:bg-[#FAF6F0] transition-colors text-left"
          >
            <div className="p-2 rounded-xl bg-[#FAF6F0] text-[#7A4B29] border border-[#E6DEC3]">
              <Warehouse className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">Estoque</span>
              <span className="text-[10px] text-gray-500 block truncate">
                Movimentações
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* STORE FEATURES & SPECIALTIES */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6DEC3] space-y-3">
        <h3 className="font-bold text-xs text-[#2C1E16] uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#7A4B29]" /> Diferenciais Uni Tudo
        </h3>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E6DEC3] space-y-1">
            <span className="font-bold text-[#7A4B29] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Gravação CO2
            </span>
            <p className="text-gray-600 text-[10px]">
              Gravação a laser de altíssima definição em madeira, inox, porongo e couro.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E6DEC3] space-y-1">
            <span className="font-bold text-[#2E6F40] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Materiais Nobres
            </span>
            <p className="text-gray-600 text-[10px]">
              Madeira Teca de reflorestamento, aço carbono 1070 e inox 304.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E6DEC3] space-y-1">
            <span className="font-bold text-[#7A4B29] flex items-center gap-1">
              <GiftBoxIcon className="w-3.5 h-3.5 text-amber-600" /> Kits & Presentes
            </span>
            <p className="text-gray-600 text-[10px]">
              Embalagens de presente em MDF pínus, fitas e gravações especiais.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E6DEC3] space-y-1">
            <span className="font-bold text-rose-700 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-600" /> Artesanal
            </span>
            <p className="text-gray-600 text-[10px]">
              Feito com carinho e dedicação do início ao acabamento final.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS CATALOG PREVIEW */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#7A6A58] uppercase tracking-wider">
            Produtos em Destaque na Loja
          </h3>
          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-bold text-[#2E6F40] hover:underline flex items-center gap-0.5"
          >
            Ver todos ({products.length})
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {products.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="bg-white p-2.5 rounded-2xl border border-[#E6DEC3] shadow-xs flex flex-col justify-between space-y-2"
            >
              <div className="w-full h-28 rounded-xl overflow-hidden border border-[#F0E8D9] bg-[#FAF6F0]">
                <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-[#7A4B29] uppercase block">
                  {p.category}
                </span>
                <h4 className="font-bold text-xs text-[#2C1E16] line-clamp-1">{p.name}</h4>
                <span className="text-xs font-extrabold text-[#2E6F40] block mt-1">
                  R$ {p.finalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={onOpenNewOrder}
                className="w-full py-1.5 bg-[#2E6F40] hover:bg-[#235832] text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
              >
                <ShoppingCart className="w-3 h-3" /> encomendar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL TO REPLACE STORE LOGO / BANNER */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] text-[#2C1E16] w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-[#E0D5C3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#7A4B29]" />
                <h3 className="font-bold text-base text-[#2C1E16]">
                  Substituir Logo da Loja
                </h3>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg px-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              {/* Image Preview Box */}
              <div className="space-y-1.5 text-center">
                <span className="text-xs font-bold text-[#5C4D3E] block">
                  Pré-visualização da Nova Imagem
                </span>

                <div className="w-full min-h-[140px] max-h-[200px] bg-white rounded-xl border border-[#DCD1BF] flex items-center justify-center overflow-hidden p-2">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Prévia da nova logo"
                      className="w-full h-auto object-contain max-h-[180px] rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs py-6 flex flex-col items-center gap-1">
                      <Camera className="w-8 h-8 text-gray-300" />
                      <span>Nenhuma imagem selecionada</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Option 1: File Upload from device */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#5C4D3E]">
                  1. Escolher arquivo da galeria / celular
                </label>
                <label className="w-full py-2.5 px-3 bg-white hover:bg-gray-50 border-2 border-dashed border-[#7A4B29] text-[#7A4B29] font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Selecionar Imagem do Dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Option 2: Image URL */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#5C4D3E]">
                  2. Ou colar URL da imagem (Link da Web)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://exemplo.com/minha-logo.jpg"
                    value={imageUrlInput}
                    onChange={(e) => {
                      setImageUrlInput(e.target.value);
                      setPreviewImage(e.target.value);
                    }}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16] focus:ring-2 focus:ring-[#2E6F40]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-[#E8DEC8] flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={!previewImage}
                  className="w-full py-2.5 bg-[#2E6F40] hover:bg-[#235832] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Salvar Nova Logo
                </button>

                {settings.storeBannerUrl && (
                  <button
                    type="button"
                    onClick={handleResetBanner}
                    className="w-full py-2 bg-transparent hover:bg-[#EFE8DB] text-[#7A4B29] font-medium text-xs rounded-xl border border-[#D4C5B0] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restaurar Logo Padrão
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Gift Box Icon
function GiftBoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M20 12v10H4V12" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}
