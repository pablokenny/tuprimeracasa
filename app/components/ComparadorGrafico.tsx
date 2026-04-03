"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { ResultadoCalculo, formatPesos } from "@/lib/bancos";

interface Props {
  resultados: ResultadoCalculo[];
}

const COLORES_DISPONIBLE = [
  "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd",
  "#1d4ed8", "#1e40af", "#1e3a8a", "#172554",
  "#dbeafe", "#bfdbfe",
];
const COLOR_NO_DISPONIBLE = "#e2e8f0";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TooltipCustom = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg text-sm">
        <p className="font-semibold text-slate-800 mb-2">{data.nombre}</p>
        <p className="text-slate-600">
          Cuota: <span className="font-bold text-blue-600">{formatPesos(data.cuota)}</span>
        </p>
        <p className="text-slate-600">
          TNA: <span className="font-medium">{data.tna}%</span>
        </p>
        <p className="text-slate-600">
          Ingreso req.: <span className="font-medium">{formatPesos(data.ingreso)}</span>
        </p>
        {!data.disponible && (
          <p className="text-red-500 text-xs mt-1">Supera financiamiento máximo</p>
        )}
      </div>
    );
  }
  return null;
};

export function ComparadorGrafico({ resultados }: Props) {
  const data = resultados
    .sort((a, b) => a.cuotaInicialPesos - b.cuotaInicialPesos)
    .map((r, i) => ({
      nombre: r.banco.nombre,
      cuota: Math.round(r.cuotaInicialPesos),
      tna: r.tna,
      ingreso: Math.round(r.ingresoRequerido),
      disponible: r.disponible,
      color: r.disponible ? COLORES_DISPONIBLE[i % COLORES_DISPONIBLE.length] : COLOR_NO_DISPONIBLE,
    }));

  const dataIngreso = [...data].sort((a, b) => a.ingreso - b.ingreso);

  return (
    <div className="space-y-8">
      {/* Gráfico cuotas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800 mb-1">Cuota inicial por banco</h2>
        <p className="text-xs text-slate-400 mb-6">Primer mes en pesos · ordenado de menor a mayor</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="nombre"
              tick={{ fontSize: 11, fill: "#64748b" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip content={<TooltipCustom />} />
            <Bar dataKey="cuota" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
            Disponible para tu solicitud
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-slate-200 inline-block" />
            No disponible (supera financiamiento máximo)
          </span>
        </div>
      </div>

      {/* Gráfico ingreso requerido */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800 mb-1">Ingreso mínimo requerido</h2>
        <p className="text-xs text-slate-400 mb-6">Basado en la regla del 25% cuota/ingreso</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={dataIngreso} margin={{ top: 5, right: 10, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="nombre"
              tick={{ fontSize: 11, fill: "#64748b" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip content={<TooltipCustom />} />
            <Bar dataKey="ingreso" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {dataIngreso.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla resumen */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Resumen comparativo</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Banco</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">TNA</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cuota inicial</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Ingreso req.</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Financia</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resultados
                .sort((a, b) => a.tna - b.tna)
                .map((r) => (
                  <tr key={r.banco.id} className={`${!r.disponible ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-slate-800">{r.banco.nombre}</td>
                    <td className="px-4 py-3 text-blue-600 font-bold">{r.tna}%</td>
                    <td className="px-4 py-3 text-slate-700">{formatPesos(r.cuotaInicialPesos)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatPesos(r.ingresoRequerido)}</td>
                    <td className="px-4 py-3 text-slate-700">{r.banco.financiacionMaxPct}%</td>
                    <td className="px-4 py-3">
                      {r.disponible ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          ✓ Disponible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          Monto excede límite
                        </span>
                      )}
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
