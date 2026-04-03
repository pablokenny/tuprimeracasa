"use client";

import { useState } from "react";

export function FormularioLead() {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", consulta: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Por ahora simula el envío — luego conectamos con un servicio real
    setEnviado(true);
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="rounded-2xl p-8 md:p-12" style={{ background: "linear-gradient(135deg, #1e40af, #7c3aed)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            ¿Querés que un experto te ayude?
          </h2>
          <p className="text-blue-100 mb-8">
            Dejá tus datos y un asesor hipotecario te contacta para guiarte en el proceso sin costo.
          </p>

          {enviado ? (
            <div className="bg-white/20 rounded-2xl p-8 text-white">
              <div className="text-4xl mb-3">✓</div>
              <p className="font-bold text-lg">¡Recibimos tu consulta!</p>
              <p className="text-blue-100 text-sm mt-1">Te contactamos en las próximas 24 horas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:bg-white/25 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:bg-white/25 transition-colors"
                />
              </div>
              <input
                type="tel"
                placeholder="WhatsApp (opcional)"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:bg-white/25 transition-colors"
              />
              <textarea
                placeholder="¿Qué necesitás? (ej: busco crédito para depto de $150M en CABA)"
                rows={3}
                value={form.consulta}
                onChange={(e) => setForm({ ...form, consulta: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:bg-white/25 transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-white text-blue-700 font-bold text-base hover:bg-blue-50 transition-colors shadow-lg"
              >
                Quiero que me asesoren gratis
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
