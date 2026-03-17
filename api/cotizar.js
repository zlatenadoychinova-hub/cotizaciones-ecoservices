export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { datos } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'API key no configurada en Vercel' }); return; }

  const prompt = `Eres el sistema de cotizaciones de ECOSERVICES DOMINICANA SRL (RNC 1-30-30508-2, Av. Barcelo KM 4.5 Naves Industrial Leonel Tavers, Santo Domingo. Tel: 809-861-1322. Email: asistenteadmin@ecoservices.com.do).

Genera una cotización profesional con estos datos:

CLIENTE:
- Empresa: ${datos.nombre}
- RNC: ${datos.rnc}
- Dirección: ${datos.dir}
- Teléfono: ${datos.tel}
- Email: ${datos.email}
- Vendedor: ${datos.vendedor}
- Fecha: ${datos.fecha}
- Condición de pago: 30 días
- Moneda: Dólar Americano (USD)

SERVICIOS SOLICITADOS: ${datos.servicios}
PRODUCTOS: ${datos.productos}

DATOS OPERATIVOS:
- Ciudad/Zona: ${datos.ciudad}
- Distancia planta-cliente (ida+vuelta): ${datos.dist}
- Frecuencia de recogida: ${datos.freq}
- Volumen estimado/mes: ${datos.vol}
- Tipo de cliente: ${datos.tipo}
- Habitaciones: ${datos.hab}
- Notas: ${datos.notas}

═══════════════════════════════════════════════
TABLA DE PRECIOS REALES ECOSERVICES 2025
═══════════════════════════════════════════════

ROLL OFF — ALQUILER DE CONTENEDOR (USD/mes):
- 10 m³: Alto=$1,134.57 | Medio=$646.01 | Bajo=$512.01
- 15 m³: Alto=$1,156.31 | Medio=$785.45 | Bajo=$572.45
- 23 m³: Alto=$1,177.76 | Medio=$865.11 | Bajo=$585.11
- 30 m³: Alto=$1,211.32 | Medio=$925.14 | Bajo=$632.21
Usar precio MEDIO como referencia si no se especifica nivel.

ROLL OFF — GESTIÓN DE RESIDUOS (USD/Tonelada, por viaje):
- Madera: $27.80/ton
- Escombros: $11.43/ton
- Papel/Cartón: $26.07/ton
- Plásticos: $26.07/ton
- Residuos Mixtos: $20.88/ton
- Acero: $22.67/ton
- Peligrosos: $1,452.92/ton

ROLL OFF — TRANSPORTE (USD/km, por viaje):
- Madera: $6.93/km
- Escombros: $6.93/km
- Papel/Cartón: $6.93/km
- Plásticos: $6.93/km
- Residuos Mixtos: $6.93/km
- Acero: $6.93/km

RESIDUOS PELIGROSOS — PRECIO POR UNIDAD (USD) 2025:
Iluminación:
- Bombillo fluorescente: $0.36/unid (ref. clientes: $1.62-$3.01)
- Bombillo LED tubo: $0.35/unid (ref. clientes: $1.52)
- Bombilla LED 50W: $0.785/unid (ref. clientes: $1.30-$1.90)
- Bombilla LED 10W: $0.32/unid
- Bombilla LED 4W: $0.12/unid
- Bombilla ahorradora: $0.32/unid
- Manguera LED: $4.30/unid
- Bombilla para piso: $1.00/unid

Baterías y pilas:
- Pilas AAA: $0.013/unid (ref. clientes: $0.22)
- Pilas AA: $0.026/unid (ref. clientes: $1.18-$1.60)
- Pilas (libras): $2.226/lb (ref. clientes: $1.57-$2.42)
- Pilas (kg): precio variable
- Batería vehículo grande: $11.50/unid
- Batería vehículo pequeña: $6.30/unid (ref. clientes: $6.39-$8.74)
- Batería recargable: $0.098/unid

Envases contaminados:
- Cubeta pintura 1 gal: $0.45/unid (ref. clientes: $1.15-$1.83)
- Cubeta pintura 5 gal: $0.45/unid (ref. clientes: $1.15-$1.55)
- Cubeta 18 gal: $0.75/unid (ref. clientes: $1.28-$5.84)
- Lata de pintura: $0.317/unid (ref. clientes: $1.13-$1.54)
- Envase químicos: $1.10/unid (ref. clientes: $2.49)
- Cartucho silicón: $0.245/unid
- Galones plásticos: $2.60/unid

RAEEs (Residuos Eléctricos y Electrónicos):
- Abanico de techo: $7.00/unid
- Abanico eléctrico: $10.00/unid (ref. clientes: $4.42)
- Batería vehículo grande (RAEE): $11.50/unid
- Batería vehículo pequeña (RAEE): $6.30/unid
- Breakers pequeñas: $0.38/unid (ref. clientes: $2.76)
- Laptop pequeña: $2.00/unid
- Monitor: $6.00/unid
- Impresora multifuncional: $9.50/unid (ref. clientes: $25.89)
- Base lámpara/bombilla: $1.115/unid (ref. clientes: $3.45)
- Porta baterías puertas: $0.35/unid

Neumáticos:
- Goma grande: $9.97/unid (ref. clientes: $15.67)
- Goma pequeña: $4.50/unid

Aceites:
- Aceite mineral (galones): $3.40/gal (ref. clientes: $12.82)

Cristal:
- Cristal por kilos: precio variable (ref. clientes: $6.34-$37.95/kg)
- Cristal por piezas: variable (ref. clientes: $6.64/pieza)

Otros peligrosos:
- Dispensador jabón: $1.30/unid
- Bomba fumigación (bagpack): $3.50/unid (ref. clientes: $8.57)
- Extintores vacíos 20lb: precio según volumen
- Toners/cartuchos impresión: precio según volumen

DECOMISOS 2025 (prendas de vestir, destrucción):
- Camisas: $29/unid | Pantalones: $31/unid | Camisetas: $21/unid
- Bolsos/Maletas: $22/unid | Vestidos mujer: $27/unid
- Gorras/Sombreros: $8/unid | Pantalonetas: $21/unid
- Calzado: $28/unid | Cinturones: $8/unid
- Café (decomisos alimentos): $42/unid

RESIDUOS GENERALES (estimados base — marcar como [⚠ EST]):
- Hotel: $28-35 USD/habitación/mes (ocupación 85%)
- Empresa mediana: $800-1,500 USD/mes
- Industrial: $1,500-4,000 USD/mes

SELLO VERDE / CERTIFICACIÓN (marcar como [⚠ EST]):
- Diagnóstico inicial: $1,500-3,000 USD
- Implementación: variable según alcance

NOTA SOBRE PRECIOS:
- "Factor" = peso unitario en kg/lb del residuo (para calcular volumen total)
- "Precio cliente" = precio que se cobra al cliente (columnas por hotel)
- Usar precio factor como base mínima; ajustar según cliente y volumen
- Para clientes nuevos sin histórico, usar precio medio de referencia

═══════════════════════════════════════════════
INSTRUCCIONES DE CÁLCULO:
═══════════════════════════════════════════════
1. Usa SIEMPRE los precios reales de la tabla anterior
2. Para Roll Off: alquiler mensual + gestión por tonelada + transporte por km (si aplica distancia)
3. Para peligrosos: precio por unidad × cantidad estimada. Si no hay cantidad, estimar y marcar [⚠ EST]
4. Para residuos generales en hotel: precio/habitación × número de habitaciones
5. ITBIS 18% sobre subtotal
6. Marca cada valor sin dato concreto con [⚠ EST]
7. NO apliques margen adicional — los precios de la tabla ya incluyen margen

FORMATO DE SALIDA (texto limpio, sin markdown, sin asteriscos):

================================================================
ECOSERVICES DOMINICANA SRL
Av. Barcelo KM 4.5, Naves Industrial Leonel Tavers
RNC: 1-30-30508-2 | Tel: 809-861-1322
================================================================
                        COTIZACIÓN
================================================================
Fecha: ${datos.fecha}         Vendedor: ${datos.vendedor}
Cliente: ${datos.nombre}
RNC: ${datos.rnc}             Condición: 30 días
Dirección: ${datos.dir}       Moneda: USD
================================================================
DESCRIPCIÓN                      CANT    PRECIO    ITBIS    TOTAL
----------------------------------------------------------------
[una fila por cada ítem con descripción, cantidad, precio unit., ITBIS, total]
================================================================
                                  Subtotal:      $X,XXX.XX
                                  Descuento:        $0.00
                                  ITBIS 18%:       $XXX.XX
                                  TOTAL USD:     $X,XXX.XX
================================================================
NOTA: Los valores [⚠ EST] son estimaciones preliminares que
requieren validación de Duvan Alvarado antes del envío al cliente.
================================================================`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    if (data.content && data.content[0]) {
      res.status(200).json({ cotizacion: data.content[0].text });
    } else {
      res.status(500).json({ error: data.error?.message || 'Error desconocido' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
