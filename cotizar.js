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

SERVICIOS: ${datos.servicios}
PRODUCTOS: ${datos.productos}

DATOS OPERATIVOS:
- Ciudad/Zona: ${datos.ciudad}
- Distancia planta-cliente (ida+vuelta): ${datos.dist}
- Frecuencia: ${datos.freq}
- Volumen/mes: ${datos.vol}
- Tipo de cliente: ${datos.tipo}
- Habitaciones: ${datos.hab}
- Notas: ${datos.notas}

INSTRUCCIONES DE CÁLCULO:
1. Para Gestión Residuos Generales en hotel: $28-35 USD/habitación/mes (ocupación 85%)
2. Para Residuos Peligrosos: disposición $150-250/ton + transporte según distancia
3. Para Roll Off: alquiler $800-1200/mes + recogida $200-400/viaje + transporte $0.37/km
4. Para Residuos Oleosos: $5-9/ton + transporte
5. Para Sello Verde: diagnóstico $1,500-3,000 + implementación según alcance
6. Para productos: catálogo DOP dividido entre 60 (tasa USD)
7. Margen comercial: 35% sobre costos operativos
8. Marca cada estimado con [⚠ EST]
9. ITBIS 18% sobre subtotal

FORMATO REQUERIDO (texto limpio, sin markdown, sin asteriscos):

================================================================
ECOSERVICES DOMINICANA SRL
Av. Barcelo KM 4.5, Naves Industrial Leonel Tavers
RNC: 1-30-30508-2 | Tel: 809-861-1322
================================================================
                        COTIZACIÓN
================================================================
Fecha: [fecha]          Vendedor: [vendedor]
Cliente: [nombre]       Moneda: USD
RNC: [rnc]              Condición: 30 días
Dirección: [dir]
================================================================
DESCRIPCIÓN                        CANT    PRECIO    ITBIS    TOTAL
----------------------------------------------------------------
[cada servicio/producto en una fila]
================================================================
                                    Subtotal:      $X,XXX.XX
                                    Descuento:        $0.00
                                    ITBIS 18%:       $XXX.XX
                                    TOTAL USD:     $X,XXX.XX
================================================================

NOTA: Los valores marcados [⚠ EST] son estimaciones preliminares
basadas en parámetros estándar del sector. Requieren validación
de Duvan Alvarado antes del envío al cliente.
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
