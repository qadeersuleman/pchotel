'use client';

import React, { useState } from 'react';
import { Users, Plus, CheckCircle2, Search, X, DollarSign, Calendar } from 'lucide-react';
import { EmployeeSalary } from '../types/hotel';

interface PayrollModuleViewProps {
  employees: EmployeeSalary[];
}

export default function PayrollModuleView({ employees: initialEmployees }: PayrollModuleViewProps) {
  const [employees, setEmployees] = useState<EmployeeSalary[]>(initialEmployees);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Employee state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<EmployeeSalary['department']>('Front Desk');
  const [designation, setDesignation] = useState('');
  const [shift, setShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [netSalary, setNetSalary] = useState<number>(35000);

  const departments: ('All' | EmployeeSalary['department'])[] = [
    'All',
    'Front Desk',
    'Housekeeping',
    'Kitchen & Restaurant',
    'Security & Maintenance',
    'Accounts',
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  const totalSalaries = employees.reduce((s, e) => s + e.netSalary, 0);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation) return;

    const newEmp: EmployeeSalary = {
      id: `emp-${Date.now()}`,
      empId: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name,
      department,
      designation,
      shift,
      basicSalary: netSalary * 0.8,
      allowance: netSalary * 0.2,
      deductions: 0,
      netSalary,
      status: 'Paid',
    };

    setEmployees([...employees, newEmp]);
    setShowAddModal(false);
    setName('');
    setDesignation('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 text-[#18181B] flex items-center justify-center font-bold shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
                  Staff Payroll &amp; Attendance Roster
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#18181B] text-white font-extrabold uppercase">
                  HR Portal
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pakistan Club Inn HR &bull; Departments, Shift Rotations &amp; Monthly Salary Disbursements
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl btn-luxury-red font-black text-xs flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Summary KPI Cards with Luxury Red Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-zinc-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Monthly Payroll</span>
            <div className="text-2xl font-black font-mono text-[#18181B] mt-1">
              Rs. {totalSalaries.toLocaleString('en-PK')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] text-[#E63946] flex items-center justify-center font-bold">
            Rs
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Active Staff Count</span>
            <div className="text-2xl font-black text-[#18181B] mt-1">
              {employees.length} Staff Members
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Shift Attendance</span>
            <div className="text-sm font-black text-emerald-600 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% On-Duty Across Shifts</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Staff Table & Department Filter */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedDept === d
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff name or role..."
              className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs border border-zinc-300 bg-white outline-none focus:border-[#E63946]"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Emp ID</th>
                <th className="p-3.5">Employee Name</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Designation</th>
                <th className="p-3.5">Shift Routine</th>
                <th className="p-3.5 font-mono text-right">Net Monthly Salary</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-zinc-50 transition">
                  <td className="p-3.5 font-mono font-black text-[#18181B]">{emp.empId}</td>
                  <td className="p-3.5 font-extrabold text-[#18181B]">{emp.name}</td>
                  <td className="p-3.5 text-zinc-600 font-medium">{emp.department}</td>
                  <td className="p-3.5 text-zinc-500">{emp.designation}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-zinc-100 text-zinc-700">
                      {emp.shift}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-right font-black text-[#18181B]">
                    Rs. {emp.netSalary.toLocaleString('en-PK')}
                  </td>
                  <td className="p-3.5 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-zinc-200 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-[#18181B]">Add Hotel Staff Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-zinc-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asadullah Jamali"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-500 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as EmployeeSalary['department'])}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white"
                  >
                    {departments.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-500 mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white"
                  >
                    <option value="Morning">Morning (08:00 - 16:00)</option>
                    <option value="Evening">Evening (16:00 - 00:00)</option>
                    <option value="Night">Night (00:00 - 08:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Front Desk Officer, Night Auditor, Room Boy"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">Net Monthly Salary (PKR)</label>
                <input
                  type="number"
                  value={netSalary}
                  onChange={(e) => setNetSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 font-mono font-bold"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl btn-luxury-red font-bold"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
