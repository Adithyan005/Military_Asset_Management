import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [filters, setFilters] = useState({ base: '', equipment: '', fromDate: '', toDate: '' });
  const [metrics, setMetrics] = useState({});
  const [equipmentList, setEquipmentList] = useState([]);
  const [baseName, setBaseName] = useState('');
  const [submittedFilters, setSubmittedFilters] = useState(null);
  const token = localStorage.getItem('token');
  const userBase = localStorage.getItem('base');

  useEffect(() => {
    async function loadEquipment() {
      if (!token) return;
      const resEquipment = await fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } });
      if (resEquipment.ok) setEquipmentList(await resEquipment.json());
    }
    loadEquipment();
  }, [token]);

  useEffect(() => {
    async function fetchBaseName() {
      if (userBase && token) {
        const res = await fetch(`${API_BASE_URL}/bases/${userBase}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const base = await res.json();
          setBaseName(base.name);
          setFilters(f => ({ ...f, base: userBase }));
        }
      }
    }
    fetchBaseName();
  }, [userBase, token]);

  useEffect(() => {
    async function loadMetrics() {
      if (!token || !submittedFilters) return;
      const qs = new URLSearchParams(submittedFilters).toString();
      const res = await fetch(`${API_BASE_URL}/dashboard?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      } else {
        setMetrics({});
      }
    }
    loadMetrics();
  }, [submittedFilters, token]);

  function onClickNetMovement() {
    alert(
      `Purchases: ${metrics.purchases || 0}\nTransfers In: ${metrics.transfersIn || 0}\nTransfers Out: ${metrics.transfersOut || 0}`
    );
  }

  function onFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    setSubmittedFilters({ ...filters, base: userBase || filters.base });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 text-lg">Equipment inventory overview and analytics</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Report Filters</h2>
            <p className="text-sm text-gray-600 mt-1">Select criteria to generate equipment metrics</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={onFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={onFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Location
                  </label>
                  <input
                    type="text"
                    name="base"
                    value={baseName}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                    placeholder="Base (fixed)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipment Type
                  </label>
                  <select
                    name="equipment"
                    value={filters.equipment}
                    onChange={onFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generate
                  </label>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">OB</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
              Opening Balance
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.openingBalance || 0}
            </p>
          </div>

          <div 
            onClick={onClickNetMovement}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-green-300 transition-all duration-200 transform hover:-translate-y-1"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onClickNetMovement();
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">NM</span>
              </div>
              <div className="text-green-500 text-sm">ℹ️</div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
              Net Movement
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.netMovement || 0}
            </p>
            <small className="text-xs text-gray-500">Click to see details</small>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">CB</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
              Closing Balance
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.closingBalance || 0}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-semibold">AS</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
              Assigned
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.assignments || 0}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold">EX</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
              Expended
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.expended || 0}
            </p>
          </div>
        </div>

        {/* Summary Section (shown only when data exists) */}
        {submittedFilters && Object.keys(metrics).length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Report Summary</h3>
              <p className="text-sm text-gray-600 mt-1">
                Period: {filters.fromDate} to {filters.toDate}
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-lg font-semibold text-blue-600 mb-1">
                    {(metrics.purchases || 0) + (metrics.transfersIn || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Inflow</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-lg font-semibold text-orange-600 mb-1">
                    {metrics.transfersOut || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Outflow</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-lg font-semibold text-green-600 mb-1">
                    {metrics.netMovement || 0}
                  </div>
                  <div className="text-sm text-gray-600">Net Change</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
