import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Transfers() {
  const [form, setForm] = useState({ fromBase: '', toBase: '', equipment: '', quantity: '', transferDate: '' });
  const [transfers, setTransfers] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userBase = localStorage.getItem('base');

  useEffect(() => {
    async function loadData() {
      const [resTransfers, resBases, resEquipment] = await Promise.all([
        fetch(`${API_BASE_URL}/transfers`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (resTransfers.ok) setTransfers(await resTransfers.json());
      if (resBases.ok) setBases(await resBases.json());
      if (resEquipment.ok) setEquipmentList(await resEquipment.json());
    }
    loadData();
  }, [token]);

  useEffect(() => {
    if (userRole === 'Logistics' && userBase) {
      const baseObj = bases.find((b) => b.name === userBase);
      if (baseObj) {
        setForm(f => ({ ...f, fromBase: baseObj._id, toBase: '' }));
      }
    } else if (userRole === 'Admin') {
      setForm(f => ({ ...f, fromBase: '', toBase: '' }));
    }
  }, [bases, userBase, userRole]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.fromBase === form.toBase) {
      alert('From Base and To Base cannot be the same.');
      return;
    }
    const res = await fetch(`${API_BASE_URL}/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
    });
    if (res.ok) {
      setForm({ fromBase: '', toBase: '', equipment: '', quantity: '', transferDate: '' });
      const updatedTransfers = await (await fetch(`${API_BASE_URL}/transfers`, { headers: { Authorization: `Bearer ${token}` } })).json();
      setTransfers(updatedTransfers);
    } else {
      alert('Failed to record transfer');
    }
  }

  const baseOptionsFrom = userRole === 'Admin' ? bases : bases.filter(b => b.name === userBase);
  const baseOptionsTo = bases;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Asset Transfer Management</h1>
          <p className="text-gray-600">Transfer equipment between military bases</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transfer Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <h2 className="text-lg font-medium text-gray-900">New Transfer Request</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Base (Source)
                  </label>
                  <select
                    name="fromBase"
                    value={form.fromBase}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    required
                    disabled={userRole === 'Logistics'}
                  >
                    <option value="">Select From Base</option>
                    {baseOptionsFrom.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center py-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">↓</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Base (Destination)
                  </label>
                  <select
                    name="toBase"
                    value={form.toBase}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={false}
                  >
                    <option value="">Select To Base</option>
                    {baseOptionsTo.map((b) => (
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    required
                  >
                    <option value="">Select Equipment</option>
                    {equipmentList.map((eq) => (
                      <option key={eq._id} value={eq._id}>
                        {eq.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      name="quantity"
                      type="number"
                      value={form.quantity}
                      onChange={onChange}
                      placeholder="0"
                      min={1}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer Date
                    </label>
                    <input
                      name="transferDate"
                      type="date"
                      value={form.transferDate}
                      onChange={onChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Record Transfer
                </button>
              </form>
            </div>
          </div>

          {/* Transfer History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Transfer History</h3>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {transfers.length} records
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {transfers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-3">🔄</div>
                    <p className="text-lg font-medium">No transfers recorded</p>
                    <p className="text-sm">Start by recording your first asset transfer</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {transfers.map((t) => (
                      <div key={t._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {/* From Base */}
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-orange-600 text-xs font-bold">F</span>
                              </div>
                              <span className="ml-2 font-medium text-gray-900 text-sm">
                                {t.fromBase?.name || t.fromBase}
                              </span>
                            </div>
                            
                            {/* Arrow */}
                            <span className="text-gray-400 text-lg">→</span>
                            
                            {/* To Base */}
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-xs font-bold">T</span>
                              </div>
                              <span className="ml-2 font-medium text-gray-900 text-sm">
                                {t.toBase?.name || t.toBase}
                              </span>
                            </div>
                          </div>
                          
                          {/* Quantity Badge */}
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {t.quantity}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-900">
                              {t.equipment?.name || t.equipment}
                            </span>
                            <span>{t.transferDate?.slice(0, 10)}</span>
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
