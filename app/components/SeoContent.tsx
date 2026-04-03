export function SeoContent() {
  const faq = [
    {
      q: "¿Qué es un crédito UVA?",
      a: "Un crédito UVA (Unidad de Valor Adquisitivo) es un préstamo hipotecario cuyo capital se actualiza según la inflación medida por el CER. La cuota inicial es más baja que un crédito tradicional, pero se ajusta mensualmente.",
    },
    {
      q: "¿Cuánto tengo que ganar para acceder a un crédito hipotecario UVA?",
      a: "El ingreso requerido varía según el banco y el monto. La regla general es que la cuota no puede superar el 25% del ingreso neto. Con un crédito de $75 millones a 20 años en el Banco Nación (6% TNA), necesitás aproximadamente $2.1 millones de ingreso mensual.",
    },
    {
      q: "¿Qué banco tiene la tasa más baja para créditos UVA en 2026?",
      a: "En 2026, el Banco Nación ofrece la tasa más baja del mercado: 6% TNA para vivienda única y permanente con acreditación de haberes. Le sigue BBVA con 7.5% TNA.",
    },
    {
      q: "¿Cuánto financia cada banco?",
      a: "Los bancos financian entre el 60% y el 80% del valor del inmueble. BBVA y Santander financian hasta el 80%, mientras que Banco Ciudad limita al 60% para su línea subsidiada.",
    },
    {
      q: "¿La cuota UVA sube con la inflación?",
      a: "Sí. La cuota se ajusta mensualmente según el coeficiente CER, que sigue a la inflación. Esto significa que en términos reales la cuota es constante, pero en pesos sube con la inflación.",
    },
    {
      q: "¿Qué plazo máximo tienen los créditos UVA?",
      a: "El plazo máximo varía por banco. Banco Nación y BBVA ofrecen hasta 30 años. La mayoría de los bancos privados tienen un máximo de 20 años.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Tu Primera Casa",
        url: "https://tuprimeracasa.vercel.app",
        description:
          "Comparador de créditos hipotecarios UVA en Argentina. Compará tasas de todos los bancos.",
        inLanguage: "es-AR",
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "FinancialProduct",
        name: "Comparador de Créditos UVA Argentina",
        description:
          "Herramienta gratuita para comparar créditos hipotecarios UVA de todos los bancos argentinos.",
        provider: { "@type": "Organization", name: "Tu Primera Casa" },
        areaServed: { "@type": "Country", name: "Argentina" },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Contenido indexable */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Preguntas frecuentes sobre créditos UVA
        </h2>
        <p className="text-slate-500 mb-8">
          Todo lo que necesitás saber antes de sacar tu crédito hipotecario.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faq.map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-2 text-base">{q}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Texto SEO adicional */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Compará créditos hipotecarios UVA en Argentina — Actualizado 2026
          </h2>
          <div className="prose prose-slate prose-sm max-w-none text-slate-500 leading-relaxed space-y-3">
            <p>
              Los créditos hipotecarios UVA son hoy la principal herramienta para acceder a la vivienda en Argentina.
              Con tasas que van del <strong>6% al 15% TNA</strong> según el banco, la diferencia en la cuota mensual
              puede ser de cientos de miles de pesos.
            </p>
            <p>
              <strong>Tu Primera Casa</strong> te permite comparar en segundos las condiciones de los 10 principales
              bancos del sistema financiero argentino: Banco Nación, BBVA, Banco Ciudad, ICBC, Banco Hipotecario,
              Banco Patagonia, Banco Macro, Santander, Galicia y Supervielle.
            </p>
            <p>
              La calculadora tiene en cuenta el valor del inmueble, el monto solicitado, el plazo y si acreditás
              haberes en el banco — factores que determinan la tasa final y el ingreso mínimo requerido.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
