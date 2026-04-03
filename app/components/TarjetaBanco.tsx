"use client";

import Image from "next/image";
import { ResultadoCalculo, formatPesos, formatNumero } from "@/lib/bancos";

interface Props {
  resultado: ResultadoCalculo;
  rank: number;
  seleccionado: boolean;
  onSeleccionar: () => void;
}

const RANK_COLORS: Record<number, string> = {
  1: "bg-amber-400 text-white",
  2: "bg-slate-300 text-white",
  3: "bg-orange-300 text-white",
};

export function TarjetaBanco({ resultado, rank, seleccionado, onSeleccionar }: Props) {
  const { banco, cuotaInicialPesos, cuotaInicialUVA, ingresoRequerido, tna, montoMaxFinanciable, disponible } = resultado;

  return (
    <div
      onClick={onSeleccionar}
      className={`rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 ${
        !disponible
          ? "border-slate-100 bg-slate-50/60 opacity-50"
          : seleccionado
          ? "border-blue-400 bg-white shadow-lg shadow-blue-100"
          : "border-slate-100 bg-white hover:border-blue-200 hover:shadow-md hover:shadow-slate-100"
      }`}
    >
      {/* Header tarjeta */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {/* Badge ranking */}
          <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${RANK_COLORS[rank] ?? "bg-slate-100 text-slate-500"}`}>
            {rank}
          </span>
          {/* Logo banco */}
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={`https://www.google.com/s2/favicons?domain=${banco.dominio}&sz=64`}
              alt={banco.nombre}
              width={28}
              height={28}
              className="object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">{banco.nombre}</h3>
            {!disponible && (
              <span className="text-xs text-red-400 font-medium">
                Supera el máximo financiable ({banco.financiacionMaxPct}%)
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {tna}%
          </span>
          <p className="text-[10px] text-slate-400 font-medium -mt-0.5">TNA + UVA</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl p-3" style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)" }}>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Cuota inicial</p>
          <p className="font-black text-slate-800 text-sm leading-tight">{formatPesos(cuotaInicialPesos)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{formatNumero(cuotaInicialUVA)} UVAs</p>
        </div>
        <div className="rounded-xl p-3 bg-slate-50">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Ingreso req.</p>
          <p className="font-black text-slate-800 text-sm leading-tight">{formatPesos(ingresoRequerido)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">regla 25%</p>
        </div>
        <div className="rounded-xl p-3 bg-slate-50">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Financia</p>
          <p className="font-black text-slate-800 text-sm leading-tight">{banco.financiacionMaxPct}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{formatPesos(montoMaxFinanciable)}</p>
        </div>
      </div>

      {/* Detalle expandible */}
      {seleccionado && disponible && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">{banco.condiciones}</p>
          <a
            href={banco.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Ver simulador oficial del banco
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}
