"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { calcularElegibilidad, formatPesos, ResultadoElegibilidad } from "@/lib/bancos";

const MILLONES = 1_000_000;

function TarjetaElegibilidad({ r, plazo }: { r: ResultadoElegibilidad; plazo: number }) {
  const [verDetalle, setVerDetalle] = useState(false);
  const califica = r.calificaConSueldo || r.calificaSinSueldo;

  return (
    <div
      className={`rounded-2xl border-2 p-5 transition-all ${
        !califica
          ? "border-slate-100 bg-slate-50/60 opacity-50"
          : "border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-blue-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={`https://www.google.com/s2/favicons?domain=${r.banco.dominio}&sz=64`}
              alt={r.banco.nombre}
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <h3 className="font-bold text-slate-800">{r.banco.nombre}</h3>
        </div>
        {califica ? (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            ✓ Calificás
          </span>
        ) : (
          <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
            No calificás
          </span>
        )}
      </div>

      {/* Dos columnas: con y sin sueldo */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Con sueldo */}
        <div className={`rounded-xl p-3 ${r.calificaConSueldo ? "bg-blue-50 border border-blue-100" : "bg-slate-50"}`}>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${r.calificaConSueldo ? "bg-blue-500" : "bg-slate-300"}`} />
            Cliente del banco
          </p>
          <p className="text-[10px] text-slate-500">TNA</p>
          <p className="font-black text-blue-700 text-base">{r.tnaConSueldo}%</p>
          <p className="text-[10px] text-slate-500 mt-1.5">Propiedad hasta</p>
          <p className="font-bold text-slate-800 text-sm">{formatPesos(r.maxPropiedadConSueldo)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Préstamo hasta</p>
          <p className="font-bold text-slate-700 text-xs">{formatPesos(r.maxPrestamoConSueldo)}</p>
        </div>

        {/* Sin sueldo */}
        <div className={`rounded-xl p-3 ${r.calificaSinSueldo ? "bg-slate-50 border border-slate-200" : "bg-slate-50"}`}>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${r.calificaSinSueldo ? "bg-slate-500" : "bg-slate-300"}`} />
            No cliente
          </p>
          <p className="text-[10px] text-slate-500">TNA</p>
          <p className="font-black text-slate-700 text-base">{r.tnaConSueldo !== r.tnaSinSueldo ? r.tnaSinSueldo : r.tnaSinSueldo}%</p>
          <p className="text-[10px] text-slate-500 mt-1.5">Propiedad hasta</p>
          <p className="font-bold text-slate-800 text-sm">{formatPesos(r.maxPropiedadSinSueldo)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Préstamo hasta</p>
          <p className="font-bold text-slate-700 text-xs">{formatPesos(r.maxPrestamoSinSueldo)}</p>
        </div>
      </div>

      {/* Cuota estimada */}
      {califica && (
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">Cuota aprox. (cliente)</span>
          <span className="font-bold text-slate-800 text-sm">{formatPesos(r.cuotaConSueldo)}/mes</span>
        </div>
      )}

      {/* Link */}
      {califica && (
        <a
          href={r.banco.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ir al simulador oficial →
        </a>
      )}
    </div>
  );
}

export function CalculadoraElegibilidad() {
  const [ingreso, setIngreso] = useState(2);
  const [ahorros, setAhorros] = useState(30);
  const [plazo, setPlazo] = useState(20);

  const resultados = useMemo(
    () => calcularElegibilidad(ingreso * MILLONES, ahorros * MILLONES, plazo),
    [ingreso, ahorros, plazo]
  );

  const califican = resultados.filter((r) => r.calificaConSueldo || r.calificaSinSueldo);
  const mejor = califican.sort((a, b) => b.maxPropiedadConSueldo - a.maxPropiedadConSueldo)[0];

  return (
    <div>
      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 shadow-md">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Tu situación financiera</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Ingreso */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Ingreso neto mensual
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
              <input
                type="number"
                value={ingreso}
                min={0.1}
                step={0.1}
                onChange={(e) => setIngreso(Number(e.target.value))}
                className="w-full pl-7 pr-10 py-3 border-2 border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-0 focus:border-blue-400 outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">M</span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{formatPesos(ingreso * MILLONES)}</p>
            <p className="text-xs text-blue-500 mt-0.5">Cuota máxima: {formatPesos(ingreso * MILLONES * 0.25)}</p>
          </div>

          {/* Ahorros */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Ahorros disponibles (entrada)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
              <input
                type="number"
                value={ahorros}
                min={0}
                step={1}
                onChange={(e) => setAhorros(Number(e.target.value))}
                className="w-full pl-7 pr-10 py-3 border-2 border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-0 focus:border-blue-400 outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">M</span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">{formatPesos(ahorros * MILLONES)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Para la parte no financiada por el banco</p>
          </div>

          {/* Plazo */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Plazo deseado: <span className="text-blue-500">{plazo} años</span>
            </label>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={plazo}
              onChange={(e) => setPlazo(Number(e.target.value))}
              className="w-full mt-4 accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
              <span>5 años</span>
              <span>30 años</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen */}
      {mejor && (
        <div className="rounded-2xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: "linear-gradient(135deg, #1e40af, #7c3aed)" }}>
          <div>
            <p className="text-blue-200 text-sm font-medium">Con tu ingreso y ahorros, podés comprar hasta</p>
            <p className="text-white text-3xl font-black">{formatPesos(mejor.maxPropiedadConSueldo)}</p>
            <p className="text-blue-200 text-xs mt-1">en {mejor.banco.nombre} siendo cliente · {mejor.tnaConSueldo}% TNA</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm">Calificás en</p>
            <p className="text-white text-4xl font-black">{califican.length}</p>
            <p className="text-blue-200 text-sm">de 10 bancos</p>
          </div>
        </div>
      )}

      {!mejor && (
        <div className="rounded-2xl p-6 mb-6 bg-amber-50 border border-amber-200 text-center">
          <p className="text-amber-800 font-bold">Con el ingreso actual no calificás en ningún banco.</p>
          <p className="text-amber-600 text-sm mt-1">Probá aumentando el plazo o el ingreso para ver opciones.</p>
        </div>
      )}

      {/* Tarjetas */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Bancos disponibles para vos</h3>
        <span className="text-sm text-slate-400 bg-white border border-slate-200 rounded-full px-3 py-1">
          <span className="font-bold text-blue-600">{califican.length}</span> de 10
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resultados
          .sort((a, b) => {
            if (a.calificaConSueldo && !b.calificaConSueldo) return -1;
            if (!a.calificaConSueldo && b.calificaConSueldo) return 1;
            return b.maxPropiedadConSueldo - a.maxPropiedadConSueldo;
          })
          .map((r) => (
            <TarjetaElegibilidad key={r.banco.id} r={r} plazo={plazo} />
          ))}
      </div>
    </div>
  );
}
