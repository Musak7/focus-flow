"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MOCK_BURNDOWN_DATA } from '../../lib/api';

export function BurndownChart() {
  return (
    <div className="h-[300px] w-full">
      <h3 className="text-lg font-bold mb-4 text-slate-800">Sprint Progress</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={MOCK_BURNDOWN_DATA}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="ideal" stroke="#cbd5e1" strokeDasharray="5 5" name="Ideal" dot={false} />
          <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} name="Actual" dot={{ r: 4, fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}