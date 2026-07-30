import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Persistent Cloud Database File Path
const DB_FILE_PATH = path.join(process.cwd(), "data", "cloud_db.json");

// Default initial database content
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    sku: "TAB-NOB-01",
    name: "Tábua de Carne Nobre em Teca (45x30cm)",
    category: "Tábua de Carne",
    mainImage: "https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=600&q=80"
    ],
    costPrice: 48.00,
    customizationCost: 14.50,
    suggestedPrice: 129.90,
    finalPrice: 129.90,
    targetMarginPercent: 51.9,
    currentStock: 14,
    minStock: 5,
    lowMarginThreshold: 35,
    description: "Tábua em madeira nobre Teca com canaleta para gordura. Ideal para gravação a laser personalizada de nomes, logotipos de empresas ou brasões de família.",
    materials: "Madeira Teca de reflorestamento, selada com óleo mineral e cera de abelha alimentícia.",
    customizationDetails: "Gravação CO2 a laser de alta precisão (12x10cm) + Embalagem kraft com fita de cetim verde mate.",
    createdAt: "2026-07-01T10:00:00.000Z",
    updatedAt: "2026-07-28T14:30:00.000Z"
  },
  {
    id: "prod-2",
    sku: "CUI-POR-02",
    name: "Cuia de Porongo Trabalhada com Bocal Inox",
    category: "Cuia & Chimarrão",
    mainImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
    ],
    costPrice: 22.00,
    customizationCost: 8.00,
    suggestedPrice: 65.00,
    finalPrice: 65.00,
    targetMarginPercent: 53.8,
    currentStock: 3,
    minStock: 5,
    lowMarginThreshold: 35,
    description: "Cuia tradicional gaúcha de porongo selecionado com bocal reforçado em aço inox. Excelente ronco do mate e alta durabilidade.",
    materials: "Porongo natural gaúcho, bocal em inox 304 e acabamento pirografado/laser.",
    customizationDetails: "Gravação a laser direta no porongo com iniciais ou símbolo tradicionalista.",
    createdAt: "2026-07-05T11:00:00.000Z",
    updatedAt: "2026-07-29T09:15:00.000Z"
  },
  {
    id: "prod-3",
    sku: "FAC-ART-10",
    name: "Faca Artesanal Churrasco 10\" Aço Carbono com Bainha",
    category: "Facas & Cutelaria",
    mainImage: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=600&q=80"
    ],
    costPrice: 95.00,
    customizationCost: 25.00,
    suggestedPrice: 249.00,
    finalPrice: 249.00,
    targetMarginPercent: 51.8,
    currentStock: 8,
    minStock: 3,
    lowMarginThreshold: 35,
    description: "Faca gaúcha em aço carbono 1070 forjado, dorso trabalhado em mosqueteado. Cabo de osso polido e chifre. Acompanha bainha de couro artesanal.",
    materials: "Lâmina em aço carbono 1070, cabo de resina e osso, bainha em couro bovino legítimo.",
    customizationDetails: "Gravação eletroquímica/laser na lâmina + gravação de nome em relevo no couro da bainha.",
    createdAt: "2026-07-10T15:20:00.000Z",
    updatedAt: "2026-07-28T16:00:00.000Z"
  },
  {
    id: "prod-4",
    sku: "BOM-INO-01",
    name: "Bomba de Inox de Bojo Removível com Bocal Folheado",
    category: "Bombas de Inox",
    mainImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
    ],
    costPrice: 35.00,
    customizationCost: 7.50,
    suggestedPrice: 89.90,
    finalPrice: 89.90,
    targetMarginPercent: 52.7,
    currentStock: 18,
    minStock: 6,
    lowMarginThreshold: 35,
    description: "Bomba de chimarrão pura em aço inox 304 com filtro de bojo rosqueável desmontável para fácil higienização. Bocal trabalhado com folheamento a ouro.",
    materials: "Aço inox 304 cirúrgico, livre de oxidação.",
    customizationDetails: "Gravação a laser fina ao longo do tubo da bomba (até 30 caracteres).",
    createdAt: "2026-07-12T09:40:00.000Z",
    updatedAt: "2026-07-27T11:20:00.000Z"
  },
  {
    id: "prod-5",
    sku: "KIT-CHUR-MDF",
    name: "Kit Churrasco Premium (Tábua + Faca 10\" + Garfo) em Estojo MDF",
    category: "Kits & Brindes",
    mainImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
    ],
    costPrice: 135.00,
    customizationCost: 38.00,
    suggestedPrice: 320.00,
    finalPrice: 215.00,
    targetMarginPercent: 45.9,
    currentStock: 5,
    minStock: 2,
    lowMarginThreshold: 35,
    description: "Conjunto completo de churrasco em estojo especial de madeira MDF. Acompanha tábua nobre, faca gaúcha e garfo trinchante.",
    materials: "Madeira nobre, aço inox, estojo MDF gravado.",
    customizationDetails: "Gravação laser na tampa do estojo + gravação individual na tábua e nas ferramentas.",
    createdAt: "2026-07-15T14:10:00.000Z",
    updatedAt: "2026-07-29T10:00:00.000Z"
  }
];

const DEFAULT_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Rodrigo Medeiros",
    phone: "(54) 99823-4411",
    email: "rodrigo.medeiros@email.com",
    city: "Caxias do Sul - RS",
    notes: "Cliente recorrente. Prefere gravações com brasão do Grêmio.",
    totalOrders: 3,
    totalSpent: 524.80,
    createdAt: "2026-06-10T10:00:00.000Z"
  },
  {
    id: "cust-2",
    name: "Juliana Camargo",
    phone: "(51) 98112-9988",
    email: "ju.camargo@empresa.com.br",
    city: "Porto Alegre - RS",
    notes: "Compradora corporativa para brindes de fim de ano.",
    totalOrders: 1,
    totalSpent: 1290.00,
    createdAt: "2026-07-02T14:20:00.000Z"
  }
];

const DEFAULT_ORDERS = [
  {
    id: "ord-101",
    orderNumber: "#PED-1041",
    customerName: "Rodrigo Medeiros",
    customerPhone: "(54) 99823-4411",
    items: [
      {
        productId: "prod-1",
        productName: "Tábua de Carne Nobre em Teca (45x30cm)",
        productImage: "https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=600&q=80",
        unitCost: 62.50,
        unitPrice: 129.90,
        quantity: 1,
        engravingText: "Gravar: \"Churrasco do Rodrigo - Desde 2012\"",
        itemNotes: "Desenho enviado via WhatsApp."
      }
    ],
    subtotal: 129.90,
    discount: 10.00,
    total: 119.90,
    totalCost: 62.50,
    profit: 57.40,
    profitMarginPercent: 47.8,
    paymentMethod: "Pix",
    status: "Em Produção",
    customizationNotes: "Foto enviada via WhatsApp.",
    deliveryAddress: "Rua Sinimbu, 1420 - Caxias do Sul/RS",
    createdAt: "2026-07-28T14:00:00.000Z",
    updatedAt: "2026-07-29T08:30:00.000Z"
  }
];

const DEFAULT_MOVEMENTS = [
  {
    id: "mov-1",
    productId: "prod-1",
    productName: "Tábua de Carne Nobre em Teca (45x30cm)",
    type: "in",
    quantity: 15,
    reason: "Compra de Lote",
    notes: "Lote de tábuas brutas de Teca.",
    date: "2026-07-01T10:30:00.000Z",
    user: "Operador Cloud"
  }
];

const DEFAULT_SETTINGS = {
  businessName: "Uni Tudo - Produtos Personalizados e Artigos Para Casa",
  defaultMinMarginPercent: 35,
  currencySymbol: "R$",
  whatsappNumber: "5551982940234",
  storeSlogan: "Do seu jeito, do seu estilo!"
};

// Initial Cloud State
let cloudDatabase = {
  products: DEFAULT_PRODUCTS,
  customers: DEFAULT_CUSTOMERS,
  orders: DEFAULT_ORDERS,
  movements: DEFAULT_MOVEMENTS,
  settings: DEFAULT_SETTINGS,
  lastUpdated: new Date().toISOString()
};

// Helper: Load database from JSON disk file
function loadDatabaseFromFile() {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        cloudDatabase = { ...cloudDatabase, ...parsed };
      }
    } else {
      saveDatabaseToFile();
    }
  } catch (err) {
    console.error("Erro ao carregar banco de dados do disco:", err);
  }
}

// Helper: Save database to JSON disk file
function saveDatabaseToFile() {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(cloudDatabase, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar banco de dados em disco:", err);
  }
}

loadDatabaseFromFile();

// List of connected SSE clients for real-time synchronization
const sseClients: Array<{ id: string; res: express.Response }> = [];

function broadcastSync(sourceClientId?: string) {
  cloudDatabase.lastUpdated = new Date().toISOString();
  saveDatabaseToFile();

  const dataString = JSON.stringify({
    type: "DATABASE_SYNC",
    payload: cloudDatabase,
    sourceClientId
  });

  sseClients.forEach((client) => {
    try {
      client.res.write(`data: ${dataString}\n\n`);
    } catch (e) {
      // client connection closed
    }
  });
}

// SSE Real-Time Sync Endpoint
app.get("/api/db/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  sseClients.push({ id: clientId, res });

  // Send initial connected event and full state
  const initPayload = JSON.stringify({
    type: "INITIAL_SYNC",
    clientId,
    payload: cloudDatabase
  });
  res.write(`data: ${initPayload}\n\n`);

  req.on("close", () => {
    const index = sseClients.findIndex((c) => c.id === clientId);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
  });
});

// REST Endpoint: Get Full Cloud DB
app.get("/api/db", (req, res) => {
  res.json({
    success: true,
    data: cloudDatabase
  });
});

// REST Endpoint: Sync State from Client
app.post("/api/db/sync", (req, res) => {
  const { products, customers, orders, movements, settings, clientId } = req.body;

  if (Array.isArray(products)) cloudDatabase.products = products;
  if (Array.isArray(customers)) cloudDatabase.customers = customers;
  if (Array.isArray(orders)) cloudDatabase.orders = orders;
  if (Array.isArray(movements)) cloudDatabase.movements = movements;
  if (settings && typeof settings === "object") cloudDatabase.settings = settings;

  broadcastSync(clientId);

  return res.json({
    success: true,
    lastUpdated: cloudDatabase.lastUpdated
  });
});

// Auth / Google Sync Status
app.post("/api/auth/google", (req, res) => {
  const { user } = req.body;
  return res.json({
    success: true,
    user,
    message: "Autenticação Google registrada e sincronizada com a nuvem."
  });
});

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Uni Tudo ERP Cloud Sync",
    connectedClients: sseClients.length,
    lastUpdated: cloudDatabase.lastUpdated
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Uni Tudo Cloud Server rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
