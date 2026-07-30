import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { useApp } from '../context/AppContext';
import { getThemeStyles } from '../utils/theme';
import {
  Package,
  DollarSign,
  AlertTriangle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  TrendingUp,
} from 'lucide-react';

interface ProductFormModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Tábua de Carne',
  'Cuia & Chimarrão',
  'Facas & Cutelaria',
  'Bombas de Inox',
  'Kits & Brindes',
  'Acessórios',
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  productToEdit,
  onClose,
}) => {
  const { addProduct, updateProduct, settings } = useApp();
  const themeStyles = getThemeStyles(settings.primaryColor);

  const [name, setName] = useState(productToEdit?.name || '');
  const [sku, setSku] = useState(
    productToEdit?.sku || `PROD-${Math.floor(100 + Math.random() * 900)}`
  );
  const [category, setCategory] = useState<ProductCategory>(
    productToEdit?.category || 'Tábua de Carne'
  );
  const [mainImage, setMainImage] = useState(
    productToEdit?.mainImage ||
      'https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=600&q=80'
  );
  const [gallery, setGallery] = useState<string[]>(
    productToEdit?.gallery && productToEdit.gallery.length > 0
      ? productToEdit.gallery
      : [mainImage]
  );
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Cost fields
  const [costPrice, setCostPrice] = useState<number>(
    productToEdit?.costPrice || 0
  );
  const [customizationCost, setCustomizationCost] = useState<number>(
    productToEdit?.customizationCost || 0
  );

  // Pricing fields
  const [targetMarginPercent, setTargetMarginPercent] = useState<number>(
    productToEdit?.targetMarginPercent || settings.defaultMinMarginPercent
  );
  const [suggestedPrice, setSuggestedPrice] = useState<number>(
    productToEdit?.suggestedPrice || 0
  );
  const [finalPrice, setFinalPrice] = useState<number>(
    productToEdit?.finalPrice || 0
  );
  const [lowMarginThreshold, setLowMarginThreshold] = useState<number>(
    productToEdit?.lowMarginThreshold || settings.defaultMinMarginPercent
  );

  // Stock fields
  const [currentStock, setCurrentStock] = useState<number>(
    productToEdit?.currentStock ?? 10
  );
  const [minStock, setMinStock] = useState<number>(
    productToEdit?.minStock ?? 3
  );

  // Details
  const [description, setDescription] = useState(
    productToEdit?.description || ''
  );
  const [materials, setMaterials] = useState(productToEdit?.materials || '');
  const [customizationDetails, setCustomizationDetails] = useState(
    productToEdit?.customizationDetails || ''
  );

  // Auto Calculations
  const totalCost = (Number(costPrice) || 0) + (Number(customizationCost) || 0);

  // Calculate suggested price whenever totalCost or target margin changes
  const calculateSuggested = (cost: number, marginPct: number) => {
    if (cost <= 0) return 0;
    if (marginPct >= 100) return cost * 2;
    return cost / (1 - marginPct / 100);
  };

  const handleCostChange = (newCost: number, newCustom: number) => {
    const tot = newCost + newCustom;
    const sug = calculateSuggested(tot, targetMarginPercent);
    setSuggestedPrice(Number(sug.toFixed(2)));
    if (!productToEdit) {
      setFinalPrice(Number(sug.toFixed(2)));
    }
  };

  const calculatedProfit = Math.max(0, (Number(finalPrice) || 0) - totalCost);
  const calculatedMargin =
    finalPrice > 0 ? (calculatedProfit / finalPrice) * 100 : 0;
  const isLowMarginAlert = calculatedMargin < lowMarginThreshold;

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGallery([...gallery, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      sku,
      name,
      category,
      mainImage,
      gallery,
      costPrice: Number(costPrice) || 0,
      customizationCost: Number(customizationCost) || 0,
      suggestedPrice: Number(suggestedPrice) || 0,
      finalPrice: Number(finalPrice) || 0,
      targetMarginPercent: Number(targetMarginPercent) || 35,
      currentStock: Number(currentStock) || 0,
      minStock: Number(minStock) || 1,
      lowMarginThreshold: Number(lowMarginThreshold) || 35,
      description,
      materials,
      customizationDetails,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-[#FAF6F0] text-[#2C1E16] w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-[#E0D5C3] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#7A4B29] text-white">
              <Package className="w-5 h-5 text-[#E2C392]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C1E16]">
                {productToEdit ? 'Editar Produto' : 'Novo Produto Personalizado'}
              </h3>
              <p className="text-[11px] text-[#7A6A58]">
                Precificação rígida, custos de gravação e fotos
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                placeholder="Ex: Tábua Teca 45x30cm Gravada"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16] focus:ring-2 focus:ring-[#2E6F40]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                SKU / Código
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16]"
                required
              />
            </div>
          </div>

          {/* Photos & Visual Gallery */}
          <div className="p-3 bg-white rounded-xl border border-[#E6DEC3] space-y-2">
            <label className="block text-xs font-bold text-[#2C1E16] flex items-center gap-1">
              <ImageIcon className="w-4 h-4 text-[#7A4B29]" /> Galeria Visual de Fotos
            </label>

            <div>
              <span className="text-[10px] text-[#7A6A58] block mb-1">
                Foto Principal (URL da Imagem)
              </span>
              <input
                type="url"
                value={mainImage}
                onChange={(e) => {
                  setMainImage(e.target.value);
                  if (!gallery.includes(e.target.value)) {
                    setGallery([e.target.value, ...gallery]);
                  }
                }}
                className="w-full text-xs px-3 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF]"
                required
              />
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {gallery.map((imgUrl, index) => (
                <div key={index} className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#DCD1BF] shrink-0 group">
                  <img src={imgUrl} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Adicionar URL de foto secundária (detalhes)..."
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF]"
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-3 py-1.5 bg-[#7A4B29] text-white text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Fotos
              </button>
            </div>
          </div>

          {/* COSTS SECTION: Custo Bruto + Custo de Personalização */}
          <div className="p-3 bg-[#FAF6F0] border border-[#E0D5C3] rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-[#7A4B29] uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> Composição de Custos Variáveis
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#5C4D3E] mb-1">
                  Valor de Custo / Compra (Bruto)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-gray-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCostPrice(val);
                      handleCostChange(val, customizationCost);
                    }}
                    className="w-full text-xs font-bold pl-8 pr-2 py-1.5 rounded-lg bg-white border border-[#DCD1BF]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5C4D3E] mb-1">
                  Custo Adicional (Gravação/Embalagem)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-gray-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={customizationCost}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCustomizationCost(val);
                      handleCostChange(costPrice, val);
                    }}
                    className="w-full text-xs font-bold pl-8 pr-2 py-1.5 rounded-lg bg-white border border-[#DCD1BF]"
                  />
                </div>
              </div>
            </div>

            {/* Total Cost Display */}
            <div className="p-2 bg-white rounded-lg border border-[#DCD1BF] flex items-center justify-between">
              <span className="text-xs font-bold text-[#5C4D3E]">Custo Total Acumulado:</span>
              <span className="text-xs font-extrabold text-[#2C1E16]">
                R$ {totalCost.toFixed(2)}
              </span>
            </div>
          </div>

          {/* PRICING & MARGINS SECTION */}
          <div className="p-3 bg-white rounded-xl border border-[#E6DEC3] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#2C1E16] uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-[#2E6F40]" /> Precificação & Margem de Lucro
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#5C4D3E] mb-1">
                  Margem Desejada (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="95"
                  value={targetMarginPercent}
                  onChange={(e) => {
                    const margin = Number(e.target.value);
                    setTargetMarginPercent(margin);
                    const sug = calculateSuggested(totalCost, margin);
                    setSuggestedPrice(Number(sug.toFixed(2)));
                  }}
                  className="w-full text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#DCD1BF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5C4D3E] mb-1">
                  Preço Sugerido ($)
                </label>
                <div className="text-xs font-extrabold py-1.5 px-2.5 bg-[#EAF3EC] text-[#2E6F40] rounded-lg border border-[#A3D9B1]">
                  R$ {suggestedPrice.toFixed(2)}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                  Preço de Venda Final Praticado (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-[#2E6F40]">R$</span>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(Number(e.target.value))}
                    className="w-full text-sm font-extrabold pl-10 pr-3 py-2 rounded-xl bg-white border-2 border-[#2E6F40] text-[#2C1E16]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Calculated Profit & Low Margin Alert */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              isLowMarginAlert
                ? 'bg-[#FFF5F5] border-[#FEB2B2] text-[#9B2C2C]'
                : 'bg-[#EAF3EC] border-[#A3D9B1] text-[#1E4D2B]'
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Lucro Real por Unidade
                </span>
                <span className="text-sm font-extrabold">
                  R$ {calculatedProfit.toFixed(2)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Margem de Lucro (%)
                </span>
                <span className="text-sm font-extrabold flex items-center gap-1 justify-end">
                  {calculatedMargin.toFixed(1)}%
                  {isLowMarginAlert && <AlertTriangle className="w-4 h-4 text-[#C53030]" />}
                </span>
              </div>
            </div>

            {/* Low Margin Warning Badge */}
            {isLowMarginAlert && (
              <div className="p-2.5 bg-[#FED7D7] border border-[#FEB2B2] rounded-xl flex items-center gap-2 text-[#9B2C2C]">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#C53030]" />
                <p className="text-[11px] font-bold leading-tight">
                  ALERTA DE MARGEM BAIXA: O preço final digitado gera apenas {calculatedMargin.toFixed(1)}% de margem (abaixo do limite configurado de {lowMarginThreshold}%).
                </p>
              </div>
            )}
          </div>

          {/* Stock Levels */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                Estoque Atual
              </label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                Estoque Mínimo (Alerta)
              </label>
              <input
                type="number"
                min="1"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
                required
              />
            </div>
          </div>

          {/* Description & Customization Notes */}
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                Descrição do Produto
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Tábua de carne para churrasco em madeira nobre Teca..."
                className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#DCD1BF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                Detalhes de Personalização Exclusiva
              </label>
              <input
                type="text"
                placeholder="Ex: Gravação laser CO2 12x10cm + caixa de MDF pínus"
                value={customizationDetails}
                onChange={(e) => setCustomizationDetails(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#DCD1BF]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#E8DEC8] flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 ${themeStyles.bgPrimary} ${themeStyles.bgHover} text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer`}
            >
              <Check className="w-4 h-4" />
              {productToEdit ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
