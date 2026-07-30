import { Product, SaleOrder, Customer, InventoryMovement, AppSettings } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  businessName: 'Uni Tudo - Produtos Personalizados e Artigos Para Casa',
  defaultMinMarginPercent: 35,
  currencySymbol: 'R$',
  whatsappNumber: '5551982940234',
  storeSlogan: 'Do seu jeito, do seu estilo!',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'TAB-NOB-01',
    name: 'Tábua de Carne Nobre em Teca (45x30cm)',
    category: 'Tábua de Carne',
    mainImage: 'https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=600&q=80'
    ],
    costPrice: 48.00,
    customizationCost: 14.50, // Gravação a laser com nome/brasão + cera de abelha + fita verde
    suggestedPrice: 129.90,
    finalPrice: 129.90,
    targetMarginPercent: 51.9,
    currentStock: 14,
    minStock: 5,
    lowMarginThreshold: 35,
    description: 'Tábua em madeira nobre Teca com canaleta para gordura. Ideal para gravação a laser personalizada de nomes, logotipos de empresas ou brasões de família.',
    materials: 'Madeira Teca de reflorestamento, selada com óleo mineral e cera de abelha alimentícia.',
    customizationDetails: 'Gravação CO2 a laser de alta precisão (12x10cm) + Embalagem kraft com fita de cetim verde mate.',
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-28T14:30:00.000Z',
  },
  {
    id: 'prod-2',
    sku: 'CUI-POR-02',
    name: 'Cuia de Porongo Trabalhada com Bocal Inox',
    category: 'Cuia & Chimarrão',
    mainImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
    ],
    costPrice: 22.00,
    customizationCost: 8.00, // Gravação laser no porongo + saquinho de veludo verde
    suggestedPrice: 65.00,
    finalPrice: 65.00,
    targetMarginPercent: 53.8,
    currentStock: 3, // Estoque baixo!
    minStock: 5,
    lowMarginThreshold: 35,
    description: 'Cuia tradicional gaúcha de porongo selecionado com bocal reforçado em aço inox. Excelente ronco do mate e alta durabilidade.',
    materials: 'Porongo natural gaúcho, bocal em inox 304 e acabamento pirografado/laser.',
    customizationDetails: 'Gravação a laser direta no porongo com iniciais ou símbolo tradicionalista.',
    createdAt: '2026-07-05T11:00:00.000Z',
    updatedAt: '2026-07-29T09:15:00.000Z',
  },
  {
    id: 'prod-3',
    sku: 'FAC-ART-10',
    name: 'Faca Artesanal Churrasco 10" Aço Carbono com Bainha',
    category: 'Facas & Cutelaria',
    mainImage: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=600&q=80'
    ],
    costPrice: 95.00,
    customizationCost: 25.00, // Gravação na lâmina de aço + personalização na bainha de couro
    suggestedPrice: 249.00,
    finalPrice: 249.00,
    targetMarginPercent: 51.8,
    currentStock: 8,
    minStock: 3,
    lowMarginThreshold: 35,
    description: 'Faca gaúcha em aço carbono 1070 forjado, dorso trabalhado em mosqueteado. Cabo de osso polido e chifre. Acompanha bainha de couro artesanal.',
    materials: 'Lâmina em aço carbono 1070, cabo de resina e osso, bainha em couro bovino legítimo.',
    customizationDetails: 'Gravação eletroquímica/laser na lâmina + gravação de nome em relevo no couro da bainha.',
    createdAt: '2026-07-10T15:20:00.000Z',
    updatedAt: '2026-07-28T16:00:00.000Z',
  },
  {
    id: 'prod-4',
    sku: 'BOM-INO-01',
    name: 'Bomba de Inox de Bojo Removível com Bocal Folheado',
    category: 'Bombas de Inox',
    mainImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
    ],
    costPrice: 35.00,
    customizationCost: 7.50, // Gravação laser no cano da bomba + escova de limpeza
    suggestedPrice: 89.90,
    finalPrice: 89.90,
    targetMarginPercent: 52.7,
    currentStock: 18,
    minStock: 6,
    lowMarginThreshold: 35,
    description: 'Bomba de chimarrão pura em aço inox 304 com filtro de bojo rosqueável desmontável para fácil higienização. Bocal trabalhado com folheamento a ouro.',
    materials: 'Aço inox 304 cirúrgico, livre de oxidação.',
    customizationDetails: 'Gravação a laser fina ao longo do tubo da bomba (até 30 caracteres).',
    createdAt: '2026-07-12T09:40:00.000Z',
    updatedAt: '2026-07-27T11:20:00.000Z',
  },
  {
    id: 'prod-5',
    sku: 'KIT-CHUR-MDF',
    name: 'Kit Churrasco Premium (Tábua + Faca 10" + Garfo) em Estojo MDF',
    category: 'Kits & Brindes',
    mainImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80'
    ],
    costPrice: 135.00,
    customizationCost: 38.00, // Gravação na caixa mdf + tábua + lâmina + fita presente
    suggestedPrice: 320.00,
    finalPrice: 215.00, // Preço reduzido de promoção - GERAR ALERTA DE MARGEM BAIXA! (Custo total 173, Venda 215 -> Lucro R$42 -> 19.5% de margem)
    targetMarginPercent: 45.9,
    currentStock: 5,
    minStock: 2,
    lowMarginThreshold: 35, // Margem atual 19.5% dispara Alerta de Margem Baixa!
    description: 'Conjunto completo de churrasco em estojo especial de madeira MDF. Acompanha tábua nobre, faca gaúcha e garfo trinchante.',
    materials: 'Madeira nobre, aço inox, estojo MDF gravado.',
    customizationDetails: 'Gravação laser na tampa do estojo + gravação individual na tábua e nas ferramentas.',
    createdAt: '2026-07-15T14:10:00.000Z',
    updatedAt: '2026-07-29T10:00:00.000Z',
  },
  {
    id: 'prod-6',
    sku: 'POR-FAK-01',
    name: 'Porta Espeto de Madeira Maciça Gravado (5 Posições)',
    category: 'Acessórios',
    mainImage: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80'
    ],
    costPrice: 28.00,
    customizationCost: 9.00,
    suggestedPrice: 79.90,
    finalPrice: 79.90,
    targetMarginPercent: 53.6,
    currentStock: 2, // Estoque baixo!
    minStock: 4,
    lowMarginThreshold: 35,
    description: 'Suporte de parede para espetos de churrasco em madeira maciça entalhada. Capacidade para 5 espetos.',
    materials: 'Madeira Itaúba / Pinus tratado.',
    customizationDetails: 'Frase personalizada gravada na parte superior (ex: "Cantinho do Churrasco do Bira").',
    createdAt: '2026-07-18T16:00:00.000Z',
    updatedAt: '2026-07-28T18:00:00.000Z',
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rodrigo Medeiros',
    phone: '(54) 99823-4411',
    email: 'rodrigo.medeiros@email.com',
    city: 'Caxias do Sul - RS',
    notes: 'Cliente recorrente. Prefere gravações com brasão do Grêmio.',
    totalOrders: 3,
    totalSpent: 524.80,
    createdAt: '2026-06-10T10:00:00.000Z',
  },
  {
    id: 'cust-2',
    name: 'Juliana Camargo',
    phone: '(51) 98112-9988',
    email: 'ju.camargo@empresa.com.br',
    city: 'Porto Alegre - RS',
    notes: 'Compradora corporativa para brindes de fim de ano de empresa de transportes.',
    totalOrders: 1,
    totalSpent: 1290.00,
    createdAt: '2026-07-02T14:20:00.000Z',
  },
  {
    id: 'cust-3',
    name: 'Everton Silveira (Tchê Churrasco)',
    phone: '(55) 99144-5533',
    city: 'Passo Fundo - RS',
    notes: 'Solicita embrulho para presente e fita verde mate.',
    totalOrders: 2,
    totalSpent: 338.90,
    createdAt: '2026-07-15T11:10:00.000Z',
  }
];

export const INITIAL_ORDERS: SaleOrder[] = [
  {
    id: 'ord-101',
    orderNumber: '#PED-1041',
    customerName: 'Rodrigo Medeiros',
    customerPhone: '(54) 99823-4411',
    items: [
      {
        productId: 'prod-1',
        productName: 'Tábua de Carne Nobre em Teca (45x30cm)',
        productImage: 'https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=600&q=80',
        unitCost: 62.50,
        unitPrice: 129.90,
        quantity: 1,
        engravingText: 'Gravar: "Churrasco do Rodrigo - Desde 2012" com brasão de touro.',
        itemNotes: 'Desenho enviado via WhatsApp.'
      },
      {
        productId: 'prod-4',
        productName: 'Bomba de Inox de Bojo Removível com Bocal Folheado',
        productImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        unitCost: 42.50,
        unitPrice: 89.90,
        quantity: 1,
        engravingText: 'Gravar: "R. Medeiros"',
      }
    ],
    subtotal: 219.80,
    discount: 10.00,
    total: 209.80,
    totalCost: 105.00,
    profit: 104.80,
    profitMarginPercent: 49.95,
    paymentMethod: 'Pix',
    status: 'Em Produção',
    customizationNotes: 'Cliente pediu para confirmar foto do protótipo a laser antes de embalar.',
    deliveryAddress: 'Rua Sinimbu, 1420, Bairro Centro - Caxias do Sul/RS',
    createdAt: '2026-07-28T14:00:00.000Z',
    updatedAt: '2026-07-29T08:30:00.000Z',
  },
  {
    id: 'ord-102',
    orderNumber: '#PED-1042',
    customerName: 'Everton Silveira (Tchê Churrasco)',
    customerPhone: '(55) 99144-5533',
    items: [
      {
        productId: 'prod-3',
        productName: 'Faca Artesanal Churrasco 10" Aço Carbono com Bainha',
        productImage: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=600&q=80',
        unitCost: 120.00,
        unitPrice: 249.00,
        quantity: 1,
        engravingText: 'Gravar na Lâmina: "Mestre Everton" / Na Bainha: "Tchê 2026"',
      }
    ],
    subtotal: 249.00,
    discount: 0.00,
    total: 249.00,
    totalCost: 120.00,
    profit: 129.00,
    profitMarginPercent: 51.8,
    paymentMethod: 'Cartão de Crédito',
    status: 'Aguardando Gravação',
    customizationNotes: 'Embalar para presente com caixa reforçada e laço de fita verde mate.',
    createdAt: '2026-07-29T10:15:00.000Z',
    updatedAt: '2026-07-29T10:15:00.000Z',
  },
  {
    id: 'ord-103',
    orderNumber: '#PED-1040',
    customerName: 'Juliana Camargo',
    customerPhone: '(51) 98112-9988',
    items: [
      {
        productId: 'prod-2',
        productName: 'Cuia de Porongo Trabalhada com Bocal Inox',
        productImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        unitCost: 30.00,
        unitPrice: 65.00,
        quantity: 2,
        engravingText: 'Gravar: Logo "TransCamargo 30 Anos"',
      }
    ],
    subtotal: 130.00,
    discount: 5.00,
    total: 125.00,
    totalCost: 60.00,
    profit: 65.00,
    profitMarginPercent: 52.0,
    paymentMethod: 'Pix',
    status: 'Entregue',
    customizationNotes: 'Entregue via Sedex. Nota emitida.',
    createdAt: '2026-07-25T11:00:00.000Z',
    updatedAt: '2026-07-27T16:45:00.000Z',
  }
];

export const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    productId: 'prod-1',
    productName: 'Tábua de Carne Nobre em Teca (45x30cm)',
    type: 'in',
    quantity: 15,
    reason: 'Compra de Lote',
    notes: 'Lote de tábuas brutas de Teca da Serraria Sul.',
    date: '2026-07-01T10:30:00.000Z',
    user: 'Operador'
  },
  {
    id: 'mov-2',
    productId: 'prod-1',
    productName: 'Tábua de Carne Nobre em Teca (45x30cm)',
    type: 'out',
    quantity: 1,
    reason: 'Venda de Pedido',
    notes: 'Reserva para Pedido #PED-1041',
    date: '2026-07-28T14:05:00.000Z',
    user: 'Sistema'
  },
  {
    id: 'mov-3',
    productId: 'prod-2',
    productName: 'Cuia de Porongo Trabalhada com Bocal Inox',
    type: 'out',
    quantity: 1,
    reason: 'Avaria / Perda na Gravação',
    notes: 'Trinca no porongo durante teste de foco do laser.',
    date: '2026-07-26T09:12:00.000Z',
    user: 'Técnico de Laser'
  },
  {
    id: 'mov-4',
    productId: 'prod-5',
    productName: 'Kit Churrasco Premium (Tábua + Faca 10" + Garfo) em Estojo MDF',
    type: 'in',
    quantity: 5,
    reason: 'Compra de Lote',
    notes: 'Entrada de estojos em MDF cortados.',
    date: '2026-07-15T14:15:00.000Z',
    user: 'Operador'
  }
];
