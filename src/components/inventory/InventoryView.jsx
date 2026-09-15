import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from '../../utils/export';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Download,
  Trash2,
  Edit2,
  TrendingDown,
  Sparkles
} from 'lucide-react';

export const InventoryView = () => {
  const {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStock,
    business
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    category: 'Hair Care',
    sku: '',
    stock: 10,
    minThreshold: 4,
    unit: 'Bottles',
    costPrice: 1500,
    retailPrice: 2800,
    supplier: ''
  });

  const lowStockItems = inventory.filter(i => i.stock <= i.minThreshold);

  const filteredItems = inventory.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;

    const payload = {
      name: form.name,
      category: form.category,
      sku: form.sku || `SKU-${Date.now().toString().slice(-4)}`,
      stock: Number(form.stock),
      minThreshold: Number(form.minThreshold),
      unit: form.unit,
      costPrice: Number(form.costPrice),
      retailPrice: Number(form.retailPrice),
      supplier: form.supplier
    };

    if (editingItem) {
      updateInventoryItem(editingItem.id, payload);
    } else {
      addInventoryItem(payload);
    }

    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleExportCSV = () => {
    exportToCSV('salon-inventory', inventory);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
            }}>
              <Package size={22} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Salon Inventory & Stock Tracker</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Monitor treatment supplies, hair dyes, serums, retail cosmetics and get instant low-stock alerts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setForm({
                name: '',
                category: 'Hair Care',
                sku: '',
                stock: 10,
                minThreshold: 4,
                unit: 'Bottles',
                costPrice: 1500,
                retailPrice: 2800,
                supplier: ''
              });
              setShowAddModal(true);
            }}
            className="btn btn-primary"
            style={{ fontWeight: '700' }}
          >
            <Plus size={18} />
            Add Product / Supply
          </button>
        </div>
      </div>

      {/* KPI Cards for Inventory */}
      <div className="kpi-grid" style={{ marginBottom: '1.75rem' }}>
        <div className="kpi-card kpi-hero-primary">
          <div className="kpi-header">
            <span className="kpi-title">Total Products in Stock</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--primary-subtle)' }}>
              <Package size={20} color="#818cf8" />
            </div>
          </div>
          <div className="kpi-value">{inventory.length} Items</div>
          <div className="kpi-subtitle">Active supplies & retail products</div>
        </div>

        <div className="kpi-card kpi-hero-lost">
          <div className="kpi-header">
            <span className="kpi-title">Low Stock Alert</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--rose-subtle)' }}>
              <AlertTriangle size={20} color="#fb7185" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: lowStockItems.length > 0 ? '#fb7185' : '#fff' }}>
            {lowStockItems.length} Items
          </div>
          <div className="kpi-subtitle">
            <span>{lowStockItems.length > 0 ? '⚠️ Reorder needed soon' : 'Stock levels healthy'}</span>
          </div>
        </div>

        <div className="kpi-card kpi-hero-recovery">
          <div className="kpi-header">
            <span className="kpi-title">Total Stock Asset Value</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--emerald-subtle)' }}>
              <Sparkles size={20} color="#34d399" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#34d399' }}>
            {formatCurrency(inventory.reduce((sum, i) => sum + (i.stock * i.costPrice), 0), business.currency)}
          </div>
          <div className="kpi-subtitle">At current wholesale cost</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div className="toolbar-row" style={{ margin: 0 }}>
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by product name, SKU or supplier..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`filter-pill ${categoryFilter === 'all' ? 'active' : ''}`}
            >
              All Categories ({inventory.length})
            </button>
            <button
              onClick={() => setCategoryFilter('Hair Care')}
              className={`filter-pill ${categoryFilter === 'Hair Care' ? 'active' : ''}`}
            >
              Hair Care
            </button>
            <button
              onClick={() => setCategoryFilter('Skin Care')}
              className={`filter-pill ${categoryFilter === 'Skin Care' ? 'active' : ''}`}
            >
              Skin Care
            </button>
            <button
              onClick={() => setCategoryFilter('Retail Product')}
              className={`filter-pill ${categoryFilter === 'Retail Product' ? 'active' : ''}`}
            >
              Retail Products
            </button>
            <button
              onClick={() => setCategoryFilter('Spa & Wellness')}
              className={`filter-pill ${categoryFilter === 'Spa & Wellness' ? 'active' : ''}`}
            >
              Spa & Wellness
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Product & SKU</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Cost Price</th>
                <th>Retail Price</th>
                <th>Supplier</th>
                <th>Quick Adjust</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const isLow = item.stock <= item.minThreshold;

                return (
                  <tr key={item.id}>
                    <td>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{item.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {item.sku}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '1.1rem', color: isLow ? '#fb7185' : '#34d399' }}>
                          {item.stock}
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                        {isLow && (
                          <span className="badge badge-rose" style={{ fontSize: '0.62rem' }}>
                            Low Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{formatCurrency(item.costPrice, business.currency)}</td>
                    <td>
                      <strong style={{ color: '#34d399' }}>{formatCurrency(item.retailPrice, business.currency)}</strong>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.supplier || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <button
                          onClick={() => adjustStock(item.id, -1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.15rem 0.45rem', fontSize: '0.85rem', fontWeight: '800' }}
                          title="Deduct 1 unit (used in treatment)"
                        >
                          -
                        </button>
                        <button
                          onClick={() => adjustStock(item.id, 1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.15rem 0.45rem', fontSize: '0.85rem', fontWeight: '800' }}
                          title="Add 1 unit (restocked)"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setForm(item);
                            setShowAddModal(true);
                          }}
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#818cf8' }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => deleteInventoryItem(item.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Inventory Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Package size={20} color="var(--primary)" />
                {editingItem ? 'Edit Product Supply' : 'Add New Inventory Item'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-icon-only">✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Keratin Complex Treatment (1000ml)"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="Hair Care">Hair Care</option>
                      <option value="Skin Care">Skin Care</option>
                      <option value="Retail Product">Retail Product</option>
                      <option value="Spa & Wellness">Spa & Wellness</option>
                      <option value="Nail Supplies">Nail Supplies</option>
                      <option value="Grooming">Grooming</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">SKU / Barcode</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. KER-100"
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Current Stock</label>
                    <input
                      type="number"
                      className="form-input"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Min Alert Level</label>
                    <input
                      type="number"
                      className="form-input"
                      value={form.minThreshold}
                      onChange={(e) => setForm({ ...form, minThreshold: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit Type</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Bottles, Sets, Units"
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Cost Price ({business.currency})</label>
                    <input
                      type="number"
                      className="form-input"
                      value={form.costPrice}
                      onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Retail Selling Price ({business.currency})</label>
                    <input
                      type="number"
                      className="form-input"
                      value={form.retailPrice}
                      onChange={(e) => setForm({ ...form, retailPrice: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Supplier / Distributor Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. L'Oreal Professional / Olaplex Distributor"
                    value={form.supplier}
                    onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingItem ? 'Save Changes' : 'Add to Inventory'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
