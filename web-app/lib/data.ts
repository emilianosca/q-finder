import { Faq } from "@/types/schema";

export function getFaqById(id: string): Faq | undefined {
  const numId = Number.parseInt(id, 10)
  return faqData.find((item) => item.id === numId)
}

export function getFaqBySlug(slug: string): Faq | undefined {
  return faqData.find((item) => item.slug === slug)
}

export function getNextFaq(id: number): Faq | undefined {
  const nextId = id + 1
  return faqData.find((item) => item.id === nextId)
}

export function getPrevFaq(id: number): Faq | undefined {
  const prevId = id - 1
  return faqData.find((item) => item.id === prevId)
}


export const faqData: Faq[] = [
  {
    id: 1,
    question: "¿Hay un período de prueba gratuito disponible?",
    answer:
      "Sí, puedes probarnos gratis durante 30 días. Si deseas, te ofrecemos una llamada de incorporación gratuita de 30 minutos para ayudarte a comenzar.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "periodo-de-prueba-gratuito",
  },
  {
    id: 2,
    question: "¿Cómo funciona la facturación?",
    answer:
      "Los planes se aplican por espacio de trabajo, no por cuenta. Puedes actualizar un espacio de trabajo y seguir teniendo cualquier cantidad de espacios gratuitos.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "como-funciona-la-facturacion",
  },
  {
    id: 3,
    question: "¿Puedo cambiar mi plan más adelante?",
    answer:
      "¡Por supuesto! Nuestro precio se adapta al crecimiento de tu empresa. Habla con nuestro amable equipo para encontrar una solución que se ajuste a tus necesidades.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "cambiar-mi-plan",
  },
  {
    id: 4,
    question: "¿Cómo cambio el correo electrónico de mi cuenta?",
    answer:
      "Puedes cambiar el correo electrónico asociado a tu cuenta ingresando a untitled.com/account desde una computadora de escritorio o portátil.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "cambiar-correo-electronico",
  },
  {
    id: 5,
    question: "¿Cuál es su política de cancelación?",
    answer:
      "Entendemos que las circunstancias pueden cambiar. Puedes cancelar tu plan en cualquier momento y te reembolsaremos el saldo proporcional ya pagado.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "politica-de-cancelacion",
  },
  {
    id: 6,
    question: "¿Cómo funciona el soporte?",
    answer:
      "Si tienes algún problema con Untitled UI, estamos aquí para ayudarte a través de hello@untitledui.com. Somos un equipo pequeño, pero te responderemos lo antes posible.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "como-funciona-el-soporte",
  },
  {
    id: 7,
    question: "¿Se puede agregar otra información a una factura?",
    answer:
      "Actualmente, la única forma de añadir información adicional a las facturas es modificando manualmente el nombre del espacio de trabajo.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "agregar-informacion-a-factura",
  },
  {
    id: 8,
    question: "¿Proporcionan tutoriales?",
    answer:
      "Todavía no, ¡pero estamos trabajando en ello! Mientras tanto, hemos hecho que la plataforma sea lo más intuitiva posible y estamos construyendo nuestra página de documentación.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "proporcionan-tutoriales",
  },
  {
    id: 9,
    question: "¿Qué significa 'acceso de por vida'?",
    answer:
      "Una vez que hayas comprado el kit de UI, tendrás acceso a todas las actualizaciones futuras sin costo adicional. Te avisaremos sobre cada nuevo lanzamiento.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "acceso-de-por-vida",
  },
  {
    id: 10,
    question: "¿Puedo usarlo para proyectos comerciales?",
    answer:
      "¡Claro! Nos encantaría verlo. Puedes usar este kit de UI para construir cualquier tipo de negocio, sitio web, aplicación o proyecto comercial.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "proyectos-comerciales",
  },
  {
    id: 11,
    question: "¿Puedo transferir mi suscripción a otra cuenta?",
    answer:
      "Sí, puedes transferir tu suscripción. Ponte en contacto con nuestro equipo de soporte para recibir asistencia personalizada en el proceso.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "transferir-suscripcion",
  },
  {
    id: 12,
    question: "¿Ofrecen descuentos para organizaciones sin fines de lucro?",
    answer:
      "¡Sí! Ofrecemos descuentos especiales para organizaciones sin fines de lucro y proyectos educativos. Escríbenos para más detalles.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "descuentos-organizaciones-sin-fines-de-lucro",
  },
  {
    id: 13,
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos todas las principales tarjetas de crédito y débito. También estamos trabajando para habilitar pagos mediante PayPal próximamente.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "metodos-de-pago",
  },
  {
    id: 14,
    question: "¿Puedo integrar Untitled UI con otras herramientas?",
    answer:
      "Estamos construyendo integraciones con plataformas populares. Actualmente puedes conectar fácilmente Untitled UI mediante nuestras APIs abiertas.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "integrar-untitled-ui-con-otras-herramientas",
  },
  {
    id: 15,
    question: "¿Ofrecen asistencia para la migración de datos?",
    answer:
      "Sí, ofrecemos asistencia gratuita para migrar tus datos durante el proceso de incorporación inicial. Nuestro equipo técnico estará encantado de ayudarte.",
    created_at: "2025-04-01T00:00:00.000Z",
    updated_at: "2025-04-01T00:00:00.000Z",
    slug: "asistencia-migracion-datos",
  },
];