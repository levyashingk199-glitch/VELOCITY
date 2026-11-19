import api from "./api";

// Cart is stored locally for now (localStorage via StoreContext).
// When the backend is ready, sync with /cart endpoints.

const USE_MOCK = true;

export const cartService = {
  async syncCart(items) {
    if (!USE_MOCK) {
      const { data } = await api.post("/cart/sync", { items });
      return data;
    }
    return { ok: true, items };
  },

  async createOrder(payload) {
    if (!USE_MOCK) {
      const { data } = await api.post("/orders", payload);
      return data;
    }
    await new Promise((r) => setTimeout(r, 900));
    return {
      id: `VL-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "Processing",
      date: new Date().toISOString(),
      ...payload,
    };
  },

  async getOrders() {
    if (!USE_MOCK) {
      const { data } = await api.get("/orders");
      return data;
    }
    await new Promise((r) => setTimeout(r, 400));
    try { return JSON.parse(localStorage.getItem("velocity_orders") || "[]"); } catch { return []; }
  },
};

export default cartService;
