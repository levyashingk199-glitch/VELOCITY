import api from "./api";

// Frontend-only auth placeholder.
// When the backend is ready, these will call /auth/login, /auth/register, etc.

const USE_MOCK = true;
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  async login(email, password) {
    if (!USE_MOCK) {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("velocity_token", data.token);
      localStorage.setItem("velocity_user", JSON.stringify(data.user));
      return data;
    }
    await delay();
    if (!email.includes("@") || password.length < 6) throw new Error("Invalid email or password (min 6 chars).");
    const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const user = { id: 1, name, email, avatar: null, joined: new Date().toISOString() };
    localStorage.setItem("velocity_token", "mock-jwt-token");
    localStorage.setItem("velocity_user", JSON.stringify(user));
    return { user, token: "mock-jwt-token" };
  },

  async register({ name, email, password }) {
    if (!USE_MOCK) {
      const { data } = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("velocity_token", data.token);
      localStorage.setItem("velocity_user", JSON.stringify(data.user));
      return data;
    }
    await delay();
    if (!name.trim()) throw new Error("Full name is required.");
    if (!email.includes("@")) throw new Error("Enter a valid email address.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");
    const user = { id: 1, name, email, avatar: null, joined: new Date().toISOString() };
    localStorage.setItem("velocity_token", "mock-jwt-token");
    localStorage.setItem("velocity_user", JSON.stringify(user));
    return { user, token: "mock-jwt-token" };
  },

  async forgotPassword(email) {
    if (!USE_MOCK) {
      const { data } = await api.post("/auth/forgot-password", { email });
      return data;
    }
    await delay();
    if (!email.includes("@")) throw new Error("Enter a valid email address.");
    return { message: `Password reset link sent to ${email}` };
  },

  async updateProfile(payload) {
    if (!USE_MOCK) {
      const { data } = await api.put("/auth/profile", payload);
      localStorage.setItem("velocity_user", JSON.stringify(data.user));
      return data;
    }
    await delay(400);
    const current = JSON.parse(localStorage.getItem("velocity_user") || "{}");
    const updated = { ...current, ...payload };
    localStorage.setItem("velocity_user", JSON.stringify(updated));
    return { user: updated };
  },

  logout() {
    localStorage.removeItem("velocity_token");
    localStorage.removeItem("velocity_user");
  },

  getCurrentUser() {
    try { return JSON.parse(localStorage.getItem("velocity_user")); } catch { return null; }
  },
};

export default authService;
