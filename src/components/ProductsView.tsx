import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { getThemeStyles } from '../utils/theme';
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  AlertCircle,
  Edit2,
  Trash2,
} from 'lucide-react';
import { ProductFormModal } from './ProductFormModal';

const CATEGORIES: ('Todos' | ProductCategory)[] = [
  'Todos',
  'Tábua de Carne',
  'Cuia & Chimarrão',
  'Facas & Cutelaria',
  'Bombas de Inox',
  'Kits & Brindes',
  'Acessórios',
];

export const ProductsView: React.FC<{ onOpenNewProduct: () => void }> = ({
  onOpenNewProduct,
}) => {
  const { products, deleteProduct, settings } = useApp();
  const themeStyles = getThemeStyles(settings.primaryColor);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | ProductCategory>('Todos');
  const [filterLowMarginOnly, setFilterLowMarginOnly] = useState(false);
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Selected image preview modal
  const [previewGalleryProduct, setPreviewGalleryProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todos' || p.category === selectedCategory;

    const totalCost = p.costPrice + p.customizationCost;
    const margin = p.finalPrice > 0 ? ((p.finalPrice - totalCost) / p.finalPrice) * 100 : 0;
    const isLowMargin = margin < (p.lowMarginThreshold || settings.defaultMinMarginPercent);

    if (filterLowMarginOnly && !isLowMargin) return false;
    if (filterLowStockOnly && p.currentStock > p.minStock) return false;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#2C1E16] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#7A4B29]" />
            Cadastro e Galeria de Produtos
          </h2>
          <p className="text-xs text-[#7A6A58]">
            {filteredProducts.length} de {products.length} produtos exibidos
          </p>
        </div>

        <button
          onClick={onOpenNewProduct}
          className={`py-2 px-3 ${themeStyles.bgPrimary} ${themeStyles.bgHover} text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer`}
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      {/* Search & Quick Toggles */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCD1BF] text-[#2C1E16] focus:ring-2 focus:ring-[#2E6F40]"
          />
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-bold px-3 py-1 rounded-xl whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#7A4B29] text-white border-[#5C381E] shadow-xs'
                  : 'bg-white text-[#6C5B4C] border-[#E6DEC3] hover:bg-[#FAF6F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setFilterLowMarginOnly(!filterLowMarginOnly)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
              filterLowMarginOnly
                ? 'bg-[#FED7D7] text-[#9B2C2C] border-[#E57373]'
                : 'bg-white text-[#7A6A58] border-[#E6DEC3]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Apenas Margem Baixa
          </button>

          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
              filterLowStockOnly
                ? 'bg-[#FFE082] text-[#B71C1C] border-[#F57C00]'
                : 'bg-white text-[#7A6A58] border-[#E6DEC3]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Estoque Crítico
          </button>
        </div>
      </div>

      {/* Product List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#E6DEC3] text-center space-y-2">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs font-bold text-[#6C5B4C]">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const totalCost = product.costPrice + product.customizationCost;
            const profit = Math.max(0, product.finalPrice - totalCost);
            const margin = product.finalPrice > 0 ? (profit / product.finalPrice) * 100 : 0;
            const isLowMargin = margin < (product.lowMarginThreshold || settings.defaultMinMarginPercent);
            const isLowStock = product.currentStock <= product.minStock;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border p-3.5 shadow-xs transition-all relative ${
                  isLowMargin
                    ? 'border-[#FEB2B2] bg-[#FFFBFB]'
                    : 'border-[#E6DEC3] hover:border-[#7A4B29]'
                }`}
              >
                {/* LOW MARGIN ALERT BADGE AT TOP */}
                {isLowMargin && (
                  <div className="mb-2 bg-[#FED7D7] border border-[#FEB2B2] px-2.5 py-1 rounded-lg flex items-center justify-between text-[#9B2C2C]">
                    <span className="text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#C53030]" />
                      ALERTA DE MARGEM BAIXA ({margin.toFixed(1)}%)
                    </span>
                    <span className="text-[9px] font-medium text-[#742A2A]">
                      Meta: {product.lowMarginThreshold || settings.defaultMinMarginPercent}%
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Photo Thumbnail */}
                  <div
                    onClick={() => setPreviewGalleryProduct(product)}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#DCD1BF] shrink-0 cursor-pointer group bg-[#FAF6F0]"
                  >
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {product.gallery.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                        +{product.gallery.length - 1} fotos
                      </span>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#7A4B29] uppercase tracking-wider bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#E6DEC3]">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {product.sku}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#2C1E16] mt-1 line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Cost & Price Row */}
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#F0E8D9]">
                      <div>
                        <span className="text-[9px] text-[#7A6A58] block">
                          Custo Total (Bruto + Personal.)
                        </span>
                        <span className="text-xs font-bold text-[#5C4D3E]">
                          R$ {totalCost.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-[#7A6A58] block">
                          Preço de Venda
                        </span>
                        <span className="text-xs font-extrabold text-[#2C1E16]">
                          R$ {product.finalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Profit & Stock Indicator */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#F0E8D9] text-[11px]">
                      <div className="flex items-center gap-1 font-bold">
                        <span className={isLowMargin ? 'text-[#C53030]' : 'text-[#2E6F40]'}>
                          Lucro: R$ {profit.toFixed(2)} ({margin.toFixed(1)}%)
                        </span>
                      </div>

                      <span
                        className={`font-bold px-2 py-0.5 rounded-md border text-[10px] ${
                          isLowStock
                            ? 'bg-[#FFE082] text-[#B71C1C] border-[#F57C00]'
                            : 'bg-[#EAF3EC] text-[#2E6F40] border-[#A3D9B1]'
                        }`}
                      >
                        Estoque: {product.currentStock} un.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex gap-2 mt-3 pt-2 border-t border-[#F0E8D9]">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowEditModal(true);
                    }}
                    className="flex-1 py-1.5 bg-[#FAF6F0] hover:bg-[#EFE8DB] text-[#7A4B29] font-bold text-[11px] rounded-lg border border-[#DCD1BF] flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar Produto
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Excluir o produto "${product.name}"?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] rounded-lg border border-red-200 flex items-center justify-center gap-1"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && (
        <ProductFormModal
          productToEdit={editingProduct}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Gallery Preview Modal */}
      {previewGalleryProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] text-[#2C1E16] w-full max-w-sm rounded-2xl p-4 shadow-2xl border border-[#E0D5C3]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E8DEC8]">
              <h3 className="font-bold text-sm truncate">
                {previewGalleryProduct.name}
              </h3>
              <button
                onClick={() => setPreviewGalleryProduct(null)}
                className="text-gray-400 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="w-full h-56 rounded-xl overflow-hidden border border-[#DCD1BF]">
                <img
                  src={previewGalleryProduct.mainImage}
                  alt={previewGalleryProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {previewGalleryProduct.gallery.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-[#7A6A58] block mb-1">
                    Galeria Secundária ({previewGalleryProduct.gallery.length} fotos)
                  </span>
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {previewGalleryProduct.gallery.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Galeria ${idx}`}
                        className="w-16 h-16 rounded-lg object-cover border border-[#DCD1BF]"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
