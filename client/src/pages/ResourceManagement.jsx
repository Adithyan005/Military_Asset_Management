import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ResourceManagement() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [bases, setBases] = useState([]);

  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'Commander', base: '' });
  const [equipmentForm, setEquipmentForm] = useState({ name: '', type: '', price: '' });
  const [baseForm, setBaseForm] = useState({ name: '', location: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function loadAll() {
      const resUsers = await fetch(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
      if (resUsers.ok) setUsers(await resUsers.json());
      const resEquip = await fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } });
      if (resEquip.ok) setEquipment(await resEquip.json());
      const resBases = await fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } });
      if (resBases.ok) setBases(await resBases.json());
    }
    loadAll();
  }, [token]);

  function handleUserChange(e) { setUserForm({ ...userForm, [e.target.name]: e.target.value }); }
  function handleEquipmentChange(e) { setEquipmentForm({ ...equipmentForm, [e.target.name]: e.target.value }); }
  function handleBaseChange(e) { setBaseForm({ ...baseForm, [e.target.name]: e.target.value }); }

  async function addUser(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(userForm)
    });
    if (res.ok) {
      setUsers(await (await fetch(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })).json());
      setUserForm({ username: '', password: '', role: 'Commander', base: '' });
    } else {
      alert('Error creating user');
    }
  }

  async function addEquipment(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/equipments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...equipmentForm, price: Number(equipmentForm.price) })
    });
    if (res.ok) {
      setEquipment(await (await fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } })).json());
      setEquipmentForm({ name: '', type: '', price: '' });
    } else {
      alert('Error adding equipment');
    }
  }

  async function addBase(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/bases`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(baseForm)
    });
    if (res.ok) {
      setBases(await (await fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } })).json());
      setBaseForm({ name: '', location: '' });
    } else {
      alert('Error adding base');
    }
  }

  const TabButton = ({ label, t }) => (
    <button
      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
        tab === t 
          ? 'bg-blue-600 text-white shadow-sm' 
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
      }`}
      onClick={() => setTab(t)}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Resource Management</h1>
          <p className="text-gray-600">Manage users, equipment, and military bases</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8">
          <TabButton label="Users" t="users" />
          <TabButton label="Equipment" t="equipment" />
          <TabButton label="Bases" t="bases" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            {tab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                  <h2 className="text-lg font-medium text-gray-900">Add New User</h2>
                </div>
                <form onSubmit={addUser} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input 
                      type="text" 
                      name="username" 
                      value={userForm.username} 
                      onChange={handleUserChange} 
                      placeholder="Enter username" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={userForm.password} 
                      onChange={handleUserChange} 
                      placeholder="Enter password" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select 
                      name="role" 
                      value={userForm.role} 
                      onChange={handleUserChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      required
                    >
                      <option value="Admin">Admin</option>
                      <option value="Commander">Commander</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
                    <input 
                      type="text" 
                      name="base" 
                      value={userForm.base} 
                      onChange={handleUserChange} 
                      placeholder="Enter base name" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Add User
                  </button>
                </form>
              </div>
            )}

            {tab === 'equipment' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                  <h2 className="text-lg font-medium text-gray-900">Add New Equipment</h2>
                </div>
                <form onSubmit={addEquipment} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={equipmentForm.name} 
                      onChange={handleEquipmentChange} 
                      placeholder="Enter equipment name" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <input 
                      type="text" 
                      name="type" 
                      value={equipmentForm.type} 
                      onChange={handleEquipmentChange} 
                      placeholder="Enter equipment type" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={equipmentForm.price} 
                      onChange={handleEquipmentChange} 
                      placeholder="Enter price" 
                      min="0" 
                      step="0.01" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Add Equipment
                  </button>
                </form>
              </div>
            )}

            {tab === 'bases' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
                  <h2 className="text-lg font-medium text-gray-900">Add New Base</h2>
                </div>
                <form onSubmit={addBase} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={baseForm.name} 
                      onChange={handleBaseChange} 
                      placeholder="Enter base name" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={baseForm.location} 
                      onChange={handleBaseChange} 
                      placeholder="Enter location" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Add Base
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Records Section */}
          <div className="lg:col-span-2">
            {tab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">System Users</h3>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {users.length} users
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {users.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-3">👥</div>
                      <p className="text-lg font-medium">No users added</p>
                      <p className="text-sm">Add your first user to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {users.map((u, i) => (
                        <div key={u._id || i} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{u.username}</h4>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Role:</span> {u.role} | <span className="font-medium">Base:</span> {u.base}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'equipment' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Equipment Catalog</h3>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {equipment.length} items
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {equipment.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-3">🔧</div>
                      <p className="text-lg font-medium">No equipment added</p>
                      <p className="text-sm">Add your first equipment to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {equipment.map((eq, i) => (
                        <div key={eq._id || i} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{eq.name}</h4>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Type:</span> {eq.type}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                ₹{eq.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'bases' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Military Bases</h3>
                    <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {bases.length} bases
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {bases.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-3">🏢</div>
                      <p className="text-lg font-medium">No bases added</p>
                      <p className="text-sm">Add your first base to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bases.map((b, i) => (
                        <div key={b._id || i} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{b.name}</h4>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Location:</span> {b.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
