"use client";
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export default function ReportsPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReportData() {
      try {
        const res = await fetch('/api/jira/sprint/issues');
        const data = await res.json();
        if (data.issues) setIssues(data.issues);
      } catch (error) {
        console.error("Error fetching report", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, []);

  // Function to download CSV
  const downloadCSV = () => {
    if (issues.length === 0) return;
    
    // Create CSV headers and rows
    const headers = ['Key', 'Summary', 'Status', 'Priority', 'Assignee'];
    const rows = issues.map(item => [
      item.key,
      `"${item.fields.summary.replace(/"/g, '""')}"`, // Handle commas/quotes
      item.fields.status.name,
      item.fields.priority?.name || 'None',
      item.fields.assignee?.displayName || 'Unassigned'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sprint_report.csv";
    link.click();
  };

  if (loading) return <div className="p-8">Generating Report...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Sprint Reports</h1>
        <button 
          onClick={downloadCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="p-4 border-b">Key</th>
              <th className="p-4 border-b">Summary</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Priority</th>
              <th className="p-4 border-b">Assignee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {issues.map((issue) => (
              <tr key={issue.key} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-blue-600">{issue.key}</td>
                <td className="p-4">{issue.fields.summary}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    issue.fields.status.name === 'Done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {issue.fields.status.name}
                  </span>
                </td>
                <td className="p-4 text-sm">{issue.fields.priority?.name}</td>
                <td className="p-4 text-sm text-gray-500">{issue.fields.assignee?.displayName || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}