'use client';

import React from 'react';
import { Users, Plus, CheckCircle2 } from 'lucide-react';
import { EmployeeSalary } from '../types/hotel';

interface PayrollModuleViewProps {
  employees: EmployeeSalary[];
}

export default function PayrollModuleView({ employees }: PayrollModuleViewProps) {
  const totalSalaries = employees.reduce((s, e) => s + e.netSalary, 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-10">
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              Staff Payroll &amp; Attendance
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">
              Pakistan Club Inn HR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Departments, Shifts (Morning, Evening, Night), Salaries &amp; Staff Attendance
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Monthly Payroll</span>
          <div className="text-xl font-bold font-mono text-slate-800 mt-1">
            Rs. {totalSalaries.toLocaleString('en-PK')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active Hotel Staff</span>
          <div className="text-xl font-bold font-mono text-amber-600 mt-1">
            {employees.length} Employees
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Today Attendance</span>
          <div className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% On-Duty across shifts</span>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-800">Hotel Staff &amp; Shift Register</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">Emp ID</th>
                <th className="p-3">Employee Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Shift</th>
                <th className="p-3 font-mono text-right">Net Salary</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono font-bold text-sky-700">{emp.empId}</td>
                  <td className="p-3 font-bold text-slate-800">{emp.name}</td>
                  <td className="p-3 text-slate-600">{emp.department}</td>
                  <td className="p-3 text-slate-500">{emp.designation}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {emp.shift}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-right font-bold text-slate-900">
                    Rs. {emp.netSalary.toLocaleString('en-PK')}
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

