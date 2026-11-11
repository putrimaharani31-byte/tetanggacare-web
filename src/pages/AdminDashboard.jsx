import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase.js';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard({ go }) {
  const [orders, setOrders] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    // Ambil data pesanan dari Supabase
    const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (orderData) setOrders(orderData);

    // Ambil total log pengunjung
    const { count } = await supabase.from('activity_logs').select('*', { count: 'exact' });
    setVisitorCount(count || 0);
  }

  // Format data grafik transaksi
  const chartData = orders.map((o) => ({
    tanggal: new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    total: Number(o.total_price || 0),
  })).reverse();

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 animate-fade-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Dashboard Admin TetanggaCare</h1>
          <p className="text-muted mt-1">Pemantauan transaksi dan pengunjung secara real-time</p>
        </div>
        <button 
          onClick={() => go('/')}
          className="px-4 py-2 bg-sand hover:bg-forest-100 text-ink font-semibold rounded-xl transition"
        >
          Kembali ke Web
        </button>
      </div>

      {/* Kartu Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-sand">
          <p className="text-sm font-medium text-muted">Total Pengunjung</p>
          <p className="text-3xl font-extrabold text-forest-700 mt-2">{visitorCount} Sesi</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-sand">
          <p className="text-sm font-medium text-muted">Total Pesanan</p>
          <p className="text-3xl font-extrabold text-forest-700 mt-2">{orders.length} Transaksi</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-sand">
          <p className="text-sm font-medium text-muted">Total Omzet</p>
          <p className="text-3xl font-extrabold text-sun mt-2">
            Rp {orders.reduce((acc, curr) => acc + Number(curr.total_price || 0), 0).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Grafik Pendapatan */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-sand">
        <h2 className="text-xl font-bold text-ink mb-4">Grafik Transaksi Masuk</h2>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="tanggal" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#078354" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full grid place-items-center text-muted">Belum ada transaksi tercatat</div>
          )}
        </div>
      </div>

      {/* Tabel Rincian Pesanan */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-sand overflow-x-auto">
        <h2 className="text-xl font-bold text-ink mb-4">Daftar Transaksi Terbaru</h2>
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-sand text-muted text-sm">
              <th className="py-3 px-2">ID Order</th>
              <th className="py-3 px-2">Nama Pemesan</th>
              <th className="py-3 px-2">Layanan</th>
              <th className="py-3 px-2">Total Biaya</th>
              <th className="py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-sand/50 text-sm hover:bg-forest-50/50">
                  <td className="py-3 px-2 font-mono font-semibold text-forest-700">{o.id}</td>
                  <td className="py-3 px-2">{o.user_name}</td>
                  <td className="py-3 px-2 capitalize">{o.service_id}</td>
                  <td className="py-3 px-2 font-bold">Rp {Number(o.total_price).toLocaleString('id-ID')}</td>
                  <td className="py-3 px-2">
                    <span className="px-2.5 py-1 bg-forest-100 text-forest-800 text-xs font-medium rounded-full">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-muted">Belum ada transaksi. Silakan buat simulasi pemesanan di web!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
