"use client";

import { useState, useMemo } from "react";
import {
  calcularCredito,
  formatPesos,
  UVA_HOY,
  BANCOS,
} from "@/lib/bancos";
import { ComparadorGrafico } from "./ComparadorGrafico";
import { TarjetaBanco } from "./TarjetaBanco";
import { CalculadoraElegibilidad } from "./CalculadoraElegibilidad";

const MILLONES = 1_000_000;

export function Calculadora() {
  const [valorInmueble, setValorInmueble] = useState(100);
  const [montoSolicitado, setMontoSolicitado] = useState(75);
  const [plazoAnios, setPlazoAnios] = useState(20);
  const [conSueldo, setConSueldo] = useState(true);
  const [vista, setVista] = useState<"calculadora" | "elegibilidad" | "comparador">("calculadora");
  const [bancoSeleccionado, setBancoSeleccionado] = useState<string | null>(null);

  const resultados = useMemo(
    () =>
      calcularCredito(
        valorInmueble * MILLONES,
        montoSolicitado * MILLONES,
        plazoAnios,
        conSueldo
      ),
    [valorInmueble, montoSolicitado, plazoAnios, conSueldo]
  );

  const resultadosDisponibles = resultados.filter((r) => r.disponible);
  const porcentajePrestamo = Math.round((montoSolicitado / valorInmueble) * 100);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 60%)" }}>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
              🏠
            </div>
            <div>
              <span className="text-lg font-bold" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Tu Primera Casa
              </span>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                UVA hoy: <span className="font-semibold text-slate-500">{formatPesos(UVA_HOY)}</span> · 03/04/2026
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setVista("calculadora")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                vista === "calculadora"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Calculadora
            </button>
            <button
              onClick={() => setVista("elegibilidad")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                vista === "elegibilidad"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              ¿Cuánto puedo pedir?
            </button>
            <button
              onClick={() => setVista("comparador")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                vista === "comparador"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Comparar bancos
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        {vista === "calculadora" && (
          <>
            <h2 className="text-3xl font-bold text-slate-800 mb-1">Encontrá el mejor crédito hipotecario UVA</h2>
            <p className="text-slate-500 text-base">Ingresá el valor de la propiedad y ves cuánto pagás en cada banco.</p>
          </>
        )}
        {vista === "elegibilidad" && (
          <>
            <h2 className="text-3xl font-bold text-slate-800 mb-1">¿A cuánto crédito podés acceder?</h2>
            <p className="text-slate-500 text-base">Ingresá tu ingreso y ahorros, y te mostramos en qué bancos calificás y hasta cuánto podés comprar.</p>
          </>
        )}
        {vista === "comparador" && (
          <>
            <h2 className="text-3xl font-bold text-slate-800 mb-1">Comparación visual de bancos</h2>
            <p className="text-slate-500 text-base">Gráficos comparativos de cuotas, tasas e ingresos requeridos.</p>
          </>
        )}
      </div>

      <main className="max-w-6xl mx-auto px-6 pb-12">

        {/* Panel de inputs — solo en calculadora y comparador */}
        {vista !== "elegibilidad" && <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8 shadow-md">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Tu situación</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Valor inmueble */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Valor del inmueble
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                <input
                  type="number"
                  value={valorInmueble}
                  min={1}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setValorInmueble(v);
                    if (montoSolicitado > v) setMontoSolicitado(v);
                  }}
                  className="w-full pl-7 pr-10 py-3 border-2 border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-0 focus:border-blue-400 outline-none transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">M</span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 font-medium">{formatPesos(valorInmueble * MILLONES)}</p>
            </div>

            {/* Monto solicitado */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Monto solicitado{" "}
                <span className="text-blue-500 font-bold">· {porcentajePrestamo}%</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                <input
                  type="number"
                  value={montoSolicitado}
                  min={1}
                  max={valorInmueble}
                  onChange={(e) => setMontoSolicitado(Number(e.target.value))}
                  className="w-full pl-7 pr-10 py-3 border-2 border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-0 focus:border-blue-400 outline-none transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">M</span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 font-medium">{formatPesos(montoSolicitado * MILLONES)}</p>
            </div>

            {/* Plazo */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Plazo: <span className="text-blue-500">{plazoAnios} años</span>
              </label>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={plazoAnios}
                onChange={(e) => setPlazoAnios(Number(e.target.value))}
                className="w-full mt-4 accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                <span>5 años</span>
                <span>30 años</span>
              </div>
            </div>

            {/* Acreditación */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                ¿Acreditás haberes en el banco?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setConSueldo(true)}
                  className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                    conSueldo
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  Sí
                </button>
                <button
                  onClick={() => setConSueldo(false)}
                  className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                    !conSueldo
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  No
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">Impacta en la tasa de cada banco</p>
            </div>
          </div>
        </div>}

        {/* Vista calculadora */}
        {vista === "calculadora" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800">Resultados por banco</h3>
              <span className="text-sm text-slate-400 bg-white border border-slate-200 rounded-full px-3 py-1">
                <span className="font-bold text-blue-600">{resultadosDisponibles.length}</span> de {BANCOS.length} bancos disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resultados
                .sort((a, b) => a.tna - b.tna)
                .map((resultado, i) => (
                  <TarjetaBanco
                    key={resultado.banco.id}
                    resultado={resultado}
                    rank={i + 1}
                    seleccionado={bancoSeleccionado === resultado.banco.id}
                    onSeleccionar={() =>
                      setBancoSeleccionado(
                        bancoSeleccionado === resultado.banco.id ? null : resultado.banco.id
                      )
                    }
                  />
                ))}
            </div>
          </div>
        )}

        {/* Vista elegibilidad */}
        {vista === "elegibilidad" && <CalculadoraElegibilidad />}

        {/* Vista comparador */}
        {vista === "comparador" && (
          <ComparadorGrafico resultados={resultados} />
        )}

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 mt-10 text-center max-w-2xl mx-auto leading-relaxed">
          Los valores son estimativos. La cuota inicial está expresada en pesos al valor UVA actual
          y se ajusta mensualmente por inflación (CER). Consultá condiciones definitivas con cada banco.
        </p>
      </main>
    </div>
  );
}
