import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AssignmentsExpenditures() {
  const [assignForm, setAssignForm] = useState({
    base: "",
    equipment: "",
    personnel: "",
    quantity: "",
    assignmentDate: "",
  });
  const [expForm, setExpForm] = useState({
    base: "",
    equipment: "",
    quantity: "",
    expenditureDate: "",
    reason: "",
  });
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [currentSection, setCurrentSection] = useState("assignment");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const userBase = localStorage.getItem("base");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    if (!token) return;

    try {
      const [basesRes, equipmentRes] = await Promise.all([
        fetch(`${API_BASE_URL}/bases`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/equipments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (basesRes.ok) setBases(await basesRes.json());
      if (equipmentRes.ok) setEquipmentList(await equipmentRes.json());

      loadAssignments();
      loadExpenditures();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  async function loadAssignments() {
    try {
      const res = await fetch(`${API_BASE_URL}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAssignments(await res.json());
    } catch (error) {
      console.error("Error loading assignments:", error);
    }
  }

  async function loadExpenditures() {
    try {
      const res = await fetch(`${API_BASE_URL}/expenditures`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setExpenditures(await res.json());
    } catch (error) {
      console.error("Error loading expenditures:", error);
    }
  }

  async function submitAssignment(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const baseValue = userRole !== "Admin" ? userBase : assignForm.base;
      const payload = {
        ...assignForm,
        base: baseValue,
        quantity: parseInt(assignForm.quantity),
      };

      const res = await fetch(`${API_BASE_URL}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAssignForm({
          base: userRole !== "Admin" ? userBase : "",
          equipment: "",
          personnel: "",
          quantity: "",
          assignmentDate: "",
        });
        loadAssignments();
      } else {
        alert(
          "Unable to save assignment. Please verify all fields and try again."
        );
      }
    } catch (error) {
      alert(
        "Network error occurred. Please check your connection and try again."
      );
    }

    setIsSubmitting(false);
  }

  async function submitExpenditure(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const baseValue = userRole !== "Admin" ? userBase : expForm.base;
      const payload = {
        ...expForm,
        base: baseValue,
        quantity: parseInt(expForm.quantity),
      };

      const res = await fetch(`${API_BASE_URL}/expenditures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setExpForm({
          base: userRole !== "Admin" ? userBase : "",
          equipment: "",
          quantity: "",
          expenditureDate: "",
          reason: "",
        });
        loadExpenditures();
      } else {
        alert(
          "Unable to save expenditure. Please verify all fields and try again."
        );
      }
    } catch (error) {
      alert(
        "Network error occurred. Please check your connection and try again."
      );
    }

    setIsSubmitting(false);
  }

  function handleAssignmentChange(e) {
    setAssignForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleExpenditureChange(e) {
    setExpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function getBaseName(id) {
    const base = bases.find((b) => b._id === id);
    return base?.name || id;
  }

  function getEquipmentName(id) {
    const equipment = equipmentList.find((eq) => eq._id === id);
    return equipment?.name || id;
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Asset Management System
            </h1>
            <p className="text-gray-600 text-lg">
              Manage equipment assignments and expenditure tracking
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setCurrentSection("assignment")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentSection === "assignment"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Equipment Assignment
              </button>
              <button
                onClick={() => setCurrentSection("expenditure")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentSection === "expenditure"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Equipment Expenditure
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="xl:col-span-1">
            {currentSection === "assignment" ? (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 bg-blue-50">
                  <h2 className="text-lg font-medium text-gray-900">
                    New Equipment Assignment
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Assign equipment to personnel
                  </p>
                </div>

                <form
                  onSubmit={submitAssignment}
                  className="px-6 py-6 space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Military Base
                    </label>
                    {userRole === "Admin" ? (
                      <select
                        name="base"
                        value={assignForm.base}
                        onChange={handleAssignmentChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a base</option>
                        {bases.map((base) => (
                          <option key={base._id} value={base._id}>
                            {base.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={getBaseName(userBase)}
                        readOnly
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Type
                    </label>
                    <select
                      name="equipment"
                      value={assignForm.equipment}
                      onChange={handleAssignmentChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select equipment</option>
                      {equipmentList.map((eq) => (
                        <option key={eq._id} value={eq._id}>
                          {eq.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Personnel
                    </label>
                    <input
                      type="text"
                      name="personnel"
                      value={assignForm.personnel}
                      onChange={handleAssignmentChange}
                      placeholder="Enter personnel name or ID"
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={assignForm.quantity}
                        onChange={handleAssignmentChange}
                        min="1"
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignment Date
                      </label>
                      <input
                        type="date"
                        name="assignmentDate"
                        value={assignForm.assignmentDate}
                        onChange={handleAssignmentChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? "Processing..." : "Create Assignment"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 bg-orange-50">
                  <h2 className="text-lg font-medium text-gray-900">
                    Record Equipment Expenditure
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Track equipment usage and disposal
                  </p>
                </div>

                <form
                  onSubmit={submitExpenditure}
                  className="px-6 py-6 space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Military Base
                    </label>
                    {userRole === "Admin" ? (
                      <select
                        name="base"
                        value={expForm.base}
                        onChange={handleExpenditureChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select a base</option>
                        {bases.map((base) => (
                          <option key={base._id} value={base._id}>
                            {base.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={getBaseName(userBase)}
                        readOnly
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Type
                    </label>
                    <select
                      name="equipment"
                      value={expForm.equipment}
                      onChange={handleExpenditureChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select equipment</option>
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
                        type="number"
                        name="quantity"
                        value={expForm.quantity}
                        onChange={handleExpenditureChange}
                        min="1"
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expenditure Date
                      </label>
                      <input
                        type="date"
                        name="expenditureDate"
                        value={expForm.expenditureDate}
                        onChange={handleExpenditureChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Expenditure
                    </label>
                    <textarea
                      name="reason"
                      value={expForm.reason}
                      onChange={handleExpenditureChange}
                      placeholder="Enter detailed reason for expenditure"
                      required
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? "Processing..." : "Record Expenditure"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Records Section */}
          <div className="xl:col-span-2">
            {currentSection === "assignment" ? (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Assignment Records
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Complete history of equipment assignments
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {assignments.length} Total Records
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {assignments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-4xl mb-4">📋</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Assignment Records
                      </h3>
                      <p className="text-gray-600">
                        Assignment records will appear here once created.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {assignments.map((assignment) => (
                        <div
                          key={assignment._id}
                          className="border border-blue-200 rounded-lg p-5 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-900 mb-3">
                                {getEquipmentName(assignment.equipment)}
                              </h4>
                              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div>
                                  <dt className="font-medium text-gray-600">
                                    Base Location:
                                  </dt>
                                  <dd className="text-gray-900">
                                    {getBaseName(assignment.base)}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="font-medium text-gray-600">
                                    Assigned Personnel:
                                  </dt>
                                  <dd className="text-gray-900">
                                    {assignment.personnel}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="font-medium text-gray-600">
                                    Assignment Date:
                                  </dt>
                                  <dd className="text-gray-900">
                                    {formatDate(assignment.assignmentDate)}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-600 text-white">
                                Qty: {assignment.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Expenditure Records
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Complete history of equipment expenditures
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {expenditures.length} Total Records
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {expenditures.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-4xl mb-4">📦</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Expenditure Records
                      </h3>
                      <p className="text-gray-600">
                        Expenditure records will appear here once created.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {expenditures.map((expenditure) => (
                        <div
                          key={expenditure._id}
                          className="border border-orange-200 rounded-lg p-5 bg-orange-50 hover:bg-orange-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-900 mb-3">
                                {getEquipmentName(expenditure.equipment)}
                              </h4>
                              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm">
                                <div>
                                  <dt className="font-medium text-gray-600">
                                    Base Location:
                                  </dt>
                                  <dd className="text-gray-900">
                                    {getBaseName(expenditure.base)}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="font-medium text-gray-600">
                                    Expenditure Date:
                                  </dt>
                                  <dd className="text-gray-900">
                                    {formatDate(expenditure.expenditureDate)}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="font-medium text-gray-600">
                                    Reason:
                                  </dt>
                                  <dd className="text-gray-900">
                                    {expenditure.reason}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-orange-600 text-white">
                                Qty: {expenditure.quantity}
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
          </div>
        </div>
      </div>
    </div>
  );
}
