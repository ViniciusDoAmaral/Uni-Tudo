import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  SaleOrder,
  Customer,
  InventoryMovement,
  AppSettings,
  OrderStatus,
  MovementType,
  MovementReason,
  GoogleUser,
  SyncStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_MOVEMENTS,
  INITIAL_SETTINGS,
} from '../data/initialData';

interface AppContextType {
  products: Product[];
  orders: SaleOrder[];
  customers: Customer[];
  movements: InventoryMovement[];
  settings: AppSettings;
  activeTab: 'home' | 'dashboard' | 'products' | 'inventory' | 'orders' | 'customers';
  setActiveTab: (tab: 'home' | 'dashboard' | 'products' | 'inventory' | 'orders' | 'customers') => void;
  
  // Google Authentication & Cloud Sync
  user: GoogleUser | null;
  syncStatus: SyncStatus;
  lastSyncTime: string | null;
  loginGoogle: (userProfile?: Partial<GoogleUser>) => void;
  logoutGoogle: () => void;
  triggerManualSync: () => Promise<void>;

  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Inventory actions
  addInventoryMovement: (
    productId: string,
    type: MovementType,
    quantity: number,
    reason: MovementReason,
    notes?: string
  ) => void;

  // Order actions
  addOrder: (order: Omit<SaleOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'createdAt'>) => void;

  // Settings
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Reset demo
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'unitudo_products_v2',
  ORDERS: 'unitudo_orders_v2',
  CUSTOMERS: 'unitudo_customers_v2',
  MOVEMENTS: 'unitudo_movements_v2',
  SETTINGS: 'unitudo_settings_v2',
  USER: 'unitudo_google_user_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'products' | 'inventory' | 'orders' | 'customers'>('home');

  const clientIdRef = useRef<string>(`client_${Math.random().toString(36).substring(2, 9)}`);

  // User State
  const [user, setUser] = useState<GoogleUser | null>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch { return null; }
    }
    // Default account if logged in
    return {
      id: 'google-user-default',
      name: 'Vinis Amaral',
      email: 'vinisamaral@gmail.com',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>('syncing');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<SaleOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [movements, setMovements] = useState<InventoryMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Local Storage Mirroring
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  // Helper: Push full state to Cloud Server
  const pushStateToCloud = async (
    newProducts = products,
    newCustomers = customers,
    newOrders = orders,
    newMovements = movements,
    newSettings = settings
  ) => {
    try {
      setSyncStatus('syncing');
      const res = await fetch('/api/db/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: newProducts,
          customers: newCustomers,
          orders: newOrders,
          movements: newMovements,
          settings: newSettings,
          clientId: clientIdRef.current,
          userEmail: user?.email
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSyncStatus('connected');
        setLastSyncTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error('Erro na sincronização na nuvem:', err);
      setSyncStatus('offline');
    }
  };

  // Initial Data Fetch & Real-Time SSE Listener
  useEffect(() => {
    // 1. Initial REST Fetch
    fetch('/api/db')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          if (json.data.products) setProducts(json.data.products);
          if (json.data.customers) setCustomers(json.data.customers);
          if (json.data.orders) setOrders(json.data.orders);
          if (json.data.movements) setMovements(json.data.movements);
          if (json.data.settings) setSettings(json.data.settings);
          setSyncStatus('connected');
          setLastSyncTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      })
      .catch((err) => {
        console.warn('Servidor offline ou sem resposta, usando cache local:', err);
        setSyncStatus('offline');
      });

    // 2. Real-Time SSE Listener
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/db/events');

      eventSource.onopen = () => {
        setSyncStatus('connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if ((parsed.type === 'INITIAL_SYNC' || parsed.type === 'DATABASE_SYNC') && parsed.payload) {
            const data = parsed.payload;
            if (data.products) setProducts(data.products);
            if (data.customers) setCustomers(data.customers);
            if (data.orders) setOrders(data.orders);
            if (data.movements) setMovements(data.movements);
            if (data.settings) setSettings(data.settings);
            setSyncStatus('connected');
            setLastSyncTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          }
        } catch (e) {
          console.error('Erro ao processar mensagem SSE:', e);
        }
      };

      eventSource.onerror = () => {
        setSyncStatus('offline');
      };
    } catch (e) {
      setSyncStatus('offline');
    }

    // Interval Fallback for Cloud Sync every 5s
    const pollInterval = setInterval(() => {
      fetch('/api/db')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            if (json.data.products) setProducts(json.data.products);
            if (json.data.customers) setCustomers(json.data.customers);
            if (json.data.orders) setOrders(json.data.orders);
            if (json.data.movements) setMovements(json.data.movements);
            if (json.data.settings) setSettings(json.data.settings);
            setSyncStatus('connected');
            setLastSyncTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          }
        })
        .catch(() => setSyncStatus('offline'));
    }, 5000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
    };
  }, []);

  // Google Login & Logout
  const loginGoogle = (userProfile?: Partial<GoogleUser>) => {
    const newUser: GoogleUser = {
      id: userProfile?.id || `google_${Date.now()}`,
      name: userProfile?.name || 'Vinis Amaral',
      email: userProfile?.email || 'vinisamaral@gmail.com',
      picture: userProfile?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    setUser(newUser);
    fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser })
    }).catch(() => {});
    pushStateToCloud();
  };

  const logoutGoogle = () => {
    setUser(null);
  };

  const triggerManualSync = async () => {
    await pushStateToCloud();
  };

  // Product Handlers
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    const updatedProds = [newProd, ...products];
    setProducts(updatedProds);

    let updatedMovs = movements;
    if (newProd.currentStock > 0) {
      const initialMov: InventoryMovement = {
        id: `mov-${Date.now()}`,
        productId: newProd.id,
        productName: newProd.name,
        type: 'in',
        quantity: newProd.currentStock,
        reason: 'Compra de Lote',
        notes: 'Estoque inicial de cadastro de produto',
        date: now,
        user: user?.name || 'Operador Cloud',
      };
      updatedMovs = [initialMov, ...movements];
      setMovements(updatedMovs);
    }

    pushStateToCloud(updatedProds, customers, orders, updatedMovs, settings);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    const now = new Date().toISOString();
    const updatedProds = products.map((p) => (p.id === id ? { ...p, ...updatedData, updatedAt: now } : p));
    setProducts(updatedProds);
    pushStateToCloud(updatedProds, customers, orders, movements, settings);
  };

  const deleteProduct = (id: string) => {
    const updatedProds = products.filter((p) => p.id !== id);
    setProducts(updatedProds);
    pushStateToCloud(updatedProds, customers, orders, movements, settings);
  };

  // Inventory Handlers
  const addInventoryMovement = (
    productId: string,
    type: MovementType,
    quantity: number,
    reason: MovementReason,
    notes?: string
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const now = new Date().toISOString();
    let newQty = prod.currentStock;

    if (type === 'in') {
      newQty += quantity;
    } else if (type === 'out') {
      newQty = Math.max(0, newQty - quantity);
    } else if (type === 'adjustment') {
      newQty = quantity;
    }

    const updatedProds = products.map((p) => (p.id === productId ? { ...p, currentStock: newQty, updatedAt: now } : p));
    setProducts(updatedProds);

    const newMov: InventoryMovement = {
      id: `mov-${Date.now()}`,
      productId,
      productName: prod.name,
      type,
      quantity,
      reason,
      notes,
      date: now,
      user: user?.name || 'Operador Cloud',
    };

    const updatedMovs = [newMov, ...movements];
    setMovements(updatedMovs);

    pushStateToCloud(updatedProds, customers, orders, updatedMovs, settings);
  };

  // Order Handlers
  const addOrder = (orderData: Omit<SaleOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const orderCount = orders.length + 1043;
    const orderNumber = `#PED-${orderCount}`;

    const newOrd: SaleOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    const updatedOrders = [newOrd, ...orders];
    setOrders(updatedOrders);

    // Deduct inventory
    let updatedProds = [...products];
    let updatedMovs = [...movements];

    newOrd.items.forEach((item) => {
      const p = updatedProds.find((prod) => prod.id === item.productId);
      if (p) {
        const newStock = Math.max(0, p.currentStock - item.quantity);
        updatedProds = updatedProds.map((prod) => (prod.id === item.productId ? { ...prod, currentStock: newStock, updatedAt: now } : prod));
        updatedMovs.unshift({
          id: `mov-${Date.now()}-${Math.random()}`,
          productId: item.productId,
          productName: item.productName,
          type: 'out',
          quantity: item.quantity,
          reason: 'Venda de Pedido',
          notes: `Saída automática do pedido ${orderNumber}`,
          date: now,
          user: user?.name || 'Sistema Cloud'
        });
      }
    });

    setProducts(updatedProds);
    setMovements(updatedMovs);

    // Update customer stats
    let updatedCustomers = [...customers];
    const existingCust = customers.find(
      (c) => c.phone.replace(/\D/g, '') === orderData.customerPhone.replace(/\D/g, '') ||
             c.name.toLowerCase() === orderData.customerName.toLowerCase()
    );

    if (existingCust) {
      updatedCustomers = customers.map((c) =>
        c.id === existingCust.id
          ? {
              ...c,
              totalOrders: c.totalOrders + 1,
              totalSpent: c.totalSpent + orderData.total,
            }
          : c
      );
      setCustomers(updatedCustomers);
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: orderData.customerName,
        phone: orderData.customerPhone,
        notes: `Cadastrado via pedido ${orderNumber}`,
        totalOrders: 1,
        totalSpent: orderData.total,
        createdAt: now,
      };
      updatedCustomers = [newCust, ...customers];
      setCustomers(updatedCustomers);
    }

    pushStateToCloud(updatedProds, updatedCustomers, updatedOrders, updatedMovs, settings);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const now = new Date().toISOString();
    const updatedOrders = orders.map((o) => (o.id === orderId ? { ...o, status, updatedAt: now } : o));
    setOrders(updatedOrders);
    pushStateToCloud(products, customers, updatedOrders, movements, settings);
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter((o) => o.id !== orderId);
    setOrders(updatedOrders);
    pushStateToCloud(products, customers, updatedOrders, movements, settings);
  };

  // Customer Handlers
  const addCustomer = (customerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      totalOrders: 1,
      totalSpent: 0,
      createdAt: now,
    };
    const updatedCustomers = [newCust, ...customers];
    setCustomers(updatedCustomers);
    pushStateToCloud(products, updatedCustomers, orders, movements, settings);
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    pushStateToCloud(products, customers, orders, movements, updated);
  };

  const resetToInitialData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setMovements(INITIAL_MOVEMENTS);
    setSettings(INITIAL_SETTINGS);
    pushStateToCloud(INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_MOVEMENTS, INITIAL_SETTINGS);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        customers,
        movements,
        settings,
        activeTab,
        setActiveTab,
        user,
        syncStatus,
        lastSyncTime,
        loginGoogle,
        logoutGoogle,
        triggerManualSync,
        addProduct,
        updateProduct,
        deleteProduct,
        addInventoryMovement,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        addCustomer,
        updateSettings,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
