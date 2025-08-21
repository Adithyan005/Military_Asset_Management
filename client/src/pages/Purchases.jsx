import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Purchases() {
  const [form, setForm] = useState({ base: '', equipment: '', quantity: '', purchaseDate: '', supplier: '' });
  const [purchases, setPurchases] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const token = localStorage.getItem('token');
  const userBase = localStorage.getItem('base');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    async function loadData() {
      const [resPurchases, resBases, resEquip] = await Promise.all([
        fetch(`${API_BASE_URL}/purchases`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (resPurchases.ok) setPurchases(await resPurchases.json());
      if (resBases.ok) setBases(await resBases.json());
      if (resEquip.ok) setEquipmentList(await resEquip.json());
    }
    loadData();
  }, [token]);

  useEffect(() => {
    if (userRole !== 'Admin' && userBase) {
      const baseObj = bases.find((b) => b._id === userBase);
      if (baseObj) setForm((f) => ({ ...f, base: baseObj._id }));
    } else if (userRole === 'Admin') {
      setForm((f) => ({ ...f, base: '' }));
    }
  }, [bases, userBase, userRole]);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
    });
    if (res.ok) {
      setForm((f) => ({ ...f, quantity: '', purchaseDate: '', supplier: '' }));
      const updatedPurchases = await (await fetch(`${API_BASE_URL}/purchases`, { headers: { Authorization: `Bearer ${token}` } })).json();
      setPurchases(updatedPurchases);
    } else {
      alert('Failed to add purchase');
    }
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Purchase Management</h1>
          <p className="text-gray-600">Record and track equipment purchases</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <h2 className="text-lg font-medium text-gray-900">Add New Purchase</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Location
                  </label>
                  <select
                    name="base"
                    value={form.base}
                    onChange={onChange}
                    required
                    disabled={userRole !== 'Admin' && !!userBase}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select Base</option>
                    {bases.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipment Type
                  </label>
                  <select
                    name="equipment"
                    value={form.equipment}
                    onChange={onChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Equipment</option>
                    {equipmentList.map((eq) => (
                      <option key={eq._id} value={eq._id}>
                        {eq.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={onChange}
                    placeholder="Enter quantity"
                    required
                    min={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date
                  </label>
                  <input
                    name="purchaseDate"
                    type="date"
                    value={form.purchaseDate}
                    onChange={onChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier (Optional)
                  </label>
                  <input
                    name="supplier"
                    value={form.supplier}
                    onChange={onChange}
                    placeholder="Enter supplier name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Purchase
                </button>
              </form>
            </div>
          </div>

          {/* Purchase History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Purchase History</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {purchases.length} records
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {purchases.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="text-lg font-medium">No purchases recorded</p>
                    <p className="text-sm">Add your first purchase to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {purchases.map((p) => (
                      <div key={p._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {p.equipment?.name || p.equipment}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="font-medium">Base:</span> {p.base?.name || p.base}
                                </div>
                                <div>
                                  <span className="font-medium">Date:</span> {p.purchaseDate?.slice(0, 10)}
                                </div>
                              </div>
                              {p.supplier && (
                                <div>
                                  <span className="font-medium">Supplier:</span> {p.supplier}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Qty: {p.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
