import api from './api';

// All catalogue data is loaded from the Node.js API. No frontend mock fallback.
export const productService = {
  async getProducts(params = {}) {
    const { data } = await api.get('/products', { params });
    return data;
  },
  async getProductById(id) {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  async getFeatured() {
    const { data } = await api.get('/products/featured');
    return data;
  },
  async getNewArrivals(limit = 8) {
    const { data } = await api.get('/products/new', { params: { limit } });
    return data;
  },
  async getSimilar(product, limit = 4) {
    const { data } = await api.get(`/products/${product.id}/similar`, { params: { limit } });
    return data;
  },
  async search(query) {
    return this.getProducts({ search: query });
  },
};

export default productService;
