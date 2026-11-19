import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8'));
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

const asArray = value => value == null ? [] : Array.isArray(value) ? value : [value];
const bool = value => value === true || value === 'true';
function filterProducts(list, query) {
  let result = [...list];
  const search = String(query.search || '').trim().toLowerCase();
  if (search) result = result.filter(p => [p.name,p.brand,p.category].some(v => String(v).toLowerCase().includes(search)));
  for (const key of ['brand','category','gender','sizes','colors']) {
    const values = asArray(query[key]).map(String);
    if (values.length) result = result.filter(p => values.some(v => key === 'sizes' ? p.sizes.map(String).includes(v) : p[key].map ? p[key].map(String).includes(v) : String(p[key]) === v));
  }
  const maxPrice = Number(query.maxPrice);
  if (Number.isFinite(maxPrice) && query.maxPrice !== '') result = result.filter(p => p.price <= maxPrice);
  if (bool(query.onSaleOnly)) result = result.filter(p => p.discount > 0);
  if (bool(query.inStockOnly)) result = result.filter(p => p.stock > 0);
  if (bool(query.onlyNew)) result = result.filter(p => p.isNew);
  switch (query.sort) {
    case 'newest': result.sort((a,b) => Number(b.isNew)-Number(a.isNew) || b.id-a.id); break;
    case 'price-asc': result.sort((a,b) => a.price-b.price); break;
    case 'price-desc': result.sort((a,b) => b.price-a.price); break;
    case 'popularity': result.sort((a,b) => b.popularity-a.popularity); break;
    case 'rating': result.sort((a,b) => b.rating-a.rating); break;
    default: result.sort((a,b) => Number(b.isFeatured)-Number(a.isFeatured) || b.popularity-a.popularity);
  }
  return result;
}

app.get('/api/health', (_req,res) => res.json({ status:'ok', service:'VELOCITY API', products:products.length }));
app.get('/api/products', (req,res) => {
  const filtered = filterProducts(products, req.query);
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 100));
  const start = (page-1)*limit;
  res.json({ products:filtered.slice(start,start+limit), total:filtered.length, page, pages:Math.ceil(filtered.length/limit) });
});
app.get('/api/products/featured', (_req,res) => res.json(products.filter(p => p.isFeatured)));
app.get('/api/products/new', (req,res) => {
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 8));
  res.json(products.filter(p => p.isNew).slice(0,limit));
});
app.get('/api/products/:id/similar', (req,res) => {
  const product = products.find(p => String(p.id) === req.params.id);
  if (!product) return res.status(404).json({ message:'Товар не найден' });
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 4));
  res.json(products.filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0,limit));
});
app.get('/api/products/:id', (req,res) => {
  const product = products.find(p => String(p.id) === req.params.id);
  if (!product) return res.status(404).json({ message:'Товар не найден' });
  res.json(product);
});
app.use((err,_req,res,_next) => { console.error(err); res.status(500).json({ message:'Внутренняя ошибка сервера' }); });
app.listen(PORT, () => console.log(`VELOCITY API running: http://localhost:${PORT}/api`));
