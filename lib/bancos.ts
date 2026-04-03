export const UVA_HOY = 1858.61; // Valor UVA al 03/04/2026 - fuente BCRA

export interface Banco {
  id: string;
  nombre: string;
  logo: string;
  dominio: string;
  tnaConSueldo: number;
  tnaSinSueldo: number;
  financiacionMaxPct: number; // % del valor del inmueble
  plazoMaxAnios: number;
  montoMaxUVA?: number;
  soloClientes?: boolean;
  condiciones?: string;
  url: string;
}

export const BANCOS: Banco[] = [
  {
    id: "bna",
    nombre: "Banco Nación",
    logo: "🏦",
    dominio: "bna.com.ar",
    tnaConSueldo: 6.0,
    tnaSinSueldo: 8.0,
    financiacionMaxPct: 75,
    plazoMaxAnios: 30,
    condiciones: "Vivienda única y permanente. Acreditación de haberes requerida para tasa preferencial.",
    url: "https://bna.com.ar/Personas/SimuladorHipotecariosUVA",
  },
  {
    id: "bbva",
    nombre: "BBVA",
    logo: "🏦",
    dominio: "bbva.com.ar",
    tnaConSueldo: 7.5,
    tnaSinSueldo: 12.5,
    financiacionMaxPct: 80,
    plazoMaxAnios: 30,
    condiciones: "Tasa 7.5% para monotributistas y relación de dependencia. Hasta 80% del valor.",
    url: "https://www.bbva.com.ar/personas/productos/creditos-hipotecarios.html",
  },
  {
    id: "ciudad",
    nombre: "Banco Ciudad",
    logo: "🏦",
    dominio: "bancociudad.com.ar",
    tnaConSueldo: 9.9,
    tnaSinSueldo: 11.5,
    financiacionMaxPct: 60,
    plazoMaxAnios: 20,
    condiciones: "Línea subsidiada para primera vivienda en CABA. Propiedades ≤80m².",
    url: "https://www.bancociudad.com.ar/",
  },
  {
    id: "icbc",
    nombre: "ICBC",
    logo: "🏦",
    dominio: "icbc.com.ar",
    tnaConSueldo: 11.0,
    tnaSinSueldo: 12.5,
    financiacionMaxPct: 75,
    plazoMaxAnios: 20,
    condiciones: "Hasta 75% del valor tasado.",
    url: "https://hipotecarios.icbc.com.ar/",
  },
  {
    id: "hipotecario",
    nombre: "Banco Hipotecario",
    logo: "🏦",
    dominio: "hipotecario.com.ar",
    tnaConSueldo: 12.5,
    tnaSinSueldo: 13.9,
    financiacionMaxPct: 80,
    plazoMaxAnios: 20,
    condiciones: "Hasta 80% de financiación.",
    url: "https://www.hipotecario.com.ar/",
  },
  {
    id: "patagonia",
    nombre: "Banco Patagonia",
    logo: "🏦",
    dominio: "bancopatagonia.com.ar",
    tnaConSueldo: 12.5,
    tnaSinSueldo: 14.0,
    financiacionMaxPct: 75,
    plazoMaxAnios: 20,
    condiciones: "Hasta 75% del valor del inmueble.",
    url: "https://www.bancopatagonia.com.ar/",
  },
  {
    id: "macro",
    nombre: "Banco Macro",
    logo: "🏦",
    dominio: "macro.com.ar",
    tnaConSueldo: 15.0,
    tnaSinSueldo: 15.0,
    financiacionMaxPct: 70,
    plazoMaxAnios: 20,
    condiciones: "Hasta 70% del valor del inmueble.",
    url: "https://www.macro.com.ar/",
  },
  {
    id: "santander",
    nombre: "Santander",
    logo: "🏦",
    dominio: "santander.com.ar",
    tnaConSueldo: 15.0,
    tnaSinSueldo: 15.0,
    financiacionMaxPct: 80,
    plazoMaxAnios: 20,
    condiciones: "Hasta 80% de financiación.",
    url: "https://www.santander.com.ar/",
  },
  {
    id: "galicia",
    nombre: "Galicia",
    logo: "🏦",
    dominio: "galicia.ar",
    tnaConSueldo: 15.0,
    tnaSinSueldo: 15.0,
    financiacionMaxPct: 80,
    plazoMaxAnios: 20,
    condiciones: "Solo para clientes del banco.",
    url: "https://www.galicia.ar/",
  },
  {
    id: "supervielle",
    nombre: "Supervielle",
    logo: "🏦",
    dominio: "supervielle.com.ar",
    tnaConSueldo: 15.0,
    tnaSinSueldo: 15.0,
    financiacionMaxPct: 75,
    plazoMaxAnios: 20,
    condiciones: "Hasta 75% del valor del inmueble.",
    url: "https://www.supervielle.com.ar/",
  },
];

export interface ResultadoCalculo {
  banco: Banco;
  cuotaInicialPesos: number;
  cuotaInicialUVA: number;
  ingresoRequerido: number;
  tna: number;
  montoMaxFinanciable: number;
  disponible: boolean; // si el monto solicitado entra dentro del financiamiento máx
}

export function calcularCredito(
  valorInmueble: number,
  montoSolicitado: number,
  plazoAnios: number,
  conSueldo: boolean
): ResultadoCalculo[] {
  return BANCOS.map((banco) => {
    const tna = conSueldo ? banco.tnaConSueldo : banco.tnaSinSueldo;
    const tem = tna / 100 / 12;
    const n = Math.min(plazoAnios, banco.plazoMaxAnios) * 12;
    const montoMaxFinanciable = valorInmueble * (banco.financiacionMaxPct / 100);
    const disponible =
      montoSolicitado <= montoMaxFinanciable && plazoAnios <= banco.plazoMaxAnios;

    // Cuota sistema francés
    const monto = disponible ? montoSolicitado : montoMaxFinanciable;
    const cuotaPesos =
      tem === 0
        ? monto / n
        : (monto * tem * Math.pow(1 + tem, n)) / (Math.pow(1 + tem, n) - 1);

    const cuotaUVA = cuotaPesos / UVA_HOY;
    const ingresoRequerido = cuotaPesos / 0.25; // regla 25%

    return {
      banco,
      cuotaInicialPesos: cuotaPesos,
      cuotaInicialUVA: cuotaUVA,
      ingresoRequerido,
      tna,
      montoMaxFinanciable,
      disponible,
    };
  });
}

export interface ResultadoElegibilidad {
  banco: Banco;
  tnaConSueldo: number;
  tnaSinSueldo: number;
  maxPrestamoConSueldo: number;
  maxPrestamoSinSueldo: number;
  maxPropiedadConSueldo: number;
  maxPropiedadSinSueldo: number;
  calificaConSueldo: boolean;
  calificaSinSueldo: boolean;
  ahorroSuficiente: boolean; // el ahorro cubre la entrada mínima
  cuotaConSueldo: number;
  cuotaSinSueldo: number;
}

// Calcula cuánto puede pedir según ingreso: despeja el monto del sistema francés
function maxMontoDesdeIngreso(ingresoNeto: number, tna: number, plazoAnios: number): number {
  const cuotaMaxima = ingresoNeto * 0.25;
  const tem = tna / 100 / 12;
  const n = plazoAnios * 12;
  if (tem === 0) return cuotaMaxima * n;
  return cuotaMaxima / (tem * Math.pow(1 + tem, n) / (Math.pow(1 + tem, n) - 1));
}

function cuotaDesdeMonto(monto: number, tna: number, plazoAnios: number): number {
  const tem = tna / 100 / 12;
  const n = plazoAnios * 12;
  if (tem === 0) return monto / n;
  return (monto * tem * Math.pow(1 + tem, n)) / (Math.pow(1 + tem, n) - 1);
}

export function calcularElegibilidad(
  ingresoNeto: number,
  ahorros: number,
  plazoAnios: number
): ResultadoElegibilidad[] {
  return BANCOS.map((banco) => {
    const plazo = Math.min(plazoAnios, banco.plazoMaxAnios);

    const maxPrestamoConSueldo = maxMontoDesdeIngreso(ingresoNeto, banco.tnaConSueldo, plazo);
    const maxPrestamoSinSueldo = maxMontoDesdeIngreso(ingresoNeto, banco.tnaSinSueldo, plazo);

    // El ahorro debe cubrir la parte no financiada: (1 - financiacion%) del valor
    // valor_propiedad = prestamo / financiacion% → entrada = valor - prestamo
    const maxPropiedadConSueldo = maxPrestamoConSueldo / (banco.financiacionMaxPct / 100);
    const maxPropiedadSinSueldo = maxPrestamoSinSueldo / (banco.financiacionMaxPct / 100);

    const entradaRequeridaConSueldo = maxPropiedadConSueldo - maxPrestamoConSueldo;
    const entradaRequeridaSinSueldo = maxPropiedadSinSueldo - maxPrestamoSinSueldo;

    const ahorroSuficienteConSueldo = ahorros >= entradaRequeridaConSueldo;
    const ahorroSuficienteSinSueldo = ahorros >= entradaRequeridaSinSueldo;

    // Si el ahorro limita: la propiedad máxima es ahorro / (1 - financiacion%)
    const propiedadMaxPorAhorroConSueldo = ahorros / (1 - banco.financiacionMaxPct / 100);
    const propiedadMaxPorAhorroSinSueldo = ahorros / (1 - banco.financiacionMaxPct / 100);

    const propFinalConSueldo = ahorroSuficienteConSueldo
      ? maxPropiedadConSueldo
      : propiedadMaxPorAhorroConSueldo;
    const propFinalSinSueldo = ahorroSuficienteSinSueldo
      ? maxPropiedadSinSueldo
      : propiedadMaxPorAhorroSinSueldo;

    const prestamoFinalConSueldo = propFinalConSueldo * (banco.financiacionMaxPct / 100);
    const prestamoFinalSinSueldo = propFinalSinSueldo * (banco.financiacionMaxPct / 100);

    const cuotaConSueldo = cuotaDesdeMonto(prestamoFinalConSueldo, banco.tnaConSueldo, plazo);
    const cuotaSinSueldo = cuotaDesdeMonto(prestamoFinalSinSueldo, banco.tnaSinSueldo, plazo);

    // Califica si el ingreso cubre al menos una cuota mínima viable ($10M de propiedad)
    const montoMinimo = 10_000_000;
    const calificaConSueldo = maxPrestamoConSueldo >= montoMinimo;
    const calificaSinSueldo = maxPrestamoSinSueldo >= montoMinimo;

    return {
      banco,
      tnaConSueldo: banco.tnaConSueldo,
      tnaSinSueldo: banco.tnaSinSueldo,
      maxPrestamoConSueldo: prestamoFinalConSueldo,
      maxPrestamoSinSueldo: prestamoFinalSinSueldo,
      maxPropiedadConSueldo: propFinalConSueldo,
      maxPropiedadSinSueldo: propFinalSinSueldo,
      calificaConSueldo,
      calificaSinSueldo,
      ahorroSuficiente: ahorroSuficienteConSueldo || ahorroSuficienteSinSueldo,
      cuotaConSueldo,
      cuotaSinSueldo,
    };
  });
}

export function formatPesos(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumero(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}
