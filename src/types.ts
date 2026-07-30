export type ProductCategory =
  | 'Tábua de Carne'
  | 'Cuia & Chimarrão'
  | 'Facas & Cutelaria'
  | 'Bombas de Inox'
  | 'Kits & Brindes'
  | 'Acessórios';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  mainImage: string;
  gallery: string[];
  costPrice: number; // Valor de custo/compra do produto bruto
  customizationCost: number; // Custo adicional (gravação laser, embalagem, fita, brinde)
  suggestedPrice: number; // Valor de venda sugerido
  finalPrice: number; // Valor de venda final praticado
  targetMarginPercent: number; // Ex: 40%
  currentStock: number;
  minStock: number; // Alerta de estoque mínimo
  lowMarginThreshold: number; // Alerta de margem baixa (default: 35%)
  description: string;
  materials: string;
  customizationDetails: string;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'in' | 'out' | 'adjustment';
export type MovementReason =
  | 'Compra de Lote'
  | 'Venda de Pedido'
  | 'Avaria / Perda na Gravação'
  | 'Ajuste de Inventário'
  | 'Brinde / Amostra';

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  reason: MovementReason;
  notes?: string;
  date: string;
  user?: string;
}

export type PaymentMethod =
  | 'Pix'
  | 'Cartão de Crédito'
  | 'Cartão de Débito'
  | 'Dinheiro'
  | 'A Prazo / Fiado';

export type OrderStatus =
  | 'Orçamento'
  | 'Aguardando Gravação'
  | 'Em Produção'
  | 'Pronto para Envio'
  | 'Entregue'
  | 'Cancelado';

export interface SaleOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unitCost: number; // (costPrice + customizationCost)
  unitPrice: number;
  quantity: number;
  engravingText?: string;
  itemNotes?: string;
}

export interface SaleOrder {
  id: string;
  orderNumber: string; // ex: #PED-1042
  customerName: string;
  customerPhone: string;
  items: SaleOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  totalCost: number;
  profit: number;
  profitMarginPercent: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  customizationNotes: string; // Texto de gravação geral, modelo de fonte, embalagem
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  notes?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export type SyncStatus = 'connected' | 'syncing' | 'offline' | 'error';

export type ThemeMode = 'light' | 'dark' | 'wood';
export type PrimaryColor = 'emerald' | 'amber' | 'blue' | 'rose' | 'purple';

export interface AppSettings {
  businessName: string;
  defaultMinMarginPercent: number;
  currencySymbol: string;
  whatsappNumber: string;
  storeBannerUrl?: string;
  storeSlogan?: string;
  themeMode?: ThemeMode;
  primaryColor?: PrimaryColor;
}
