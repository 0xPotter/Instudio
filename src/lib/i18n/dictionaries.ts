export const dictionaries = {
  en: {
    nav: {
      work: "Work",
      studio: "Studio",
      audio: "Audio",
      labs: "Labs",
      contact: "Contact",
      cta: "Get in Touch",
      menu: "Menu",
      close: "Close",
      languageLabel: "Language",
    },
    hero: {
      eyebrow: "EST. 2024 — DIGITAL CURATION",
      titleLine1: "INTELIGENCIA",
      titleLine2: "NATURAL",
      description:
        "We craft visual and logistical solutions with a refined human eye and the power of AI as our ally — together, we make the extraordinary possible.",
      counter: "01/03",
    },
    ecosystem: {
      heading: "The Ecosystem",
      cards: {
        inlabs: {
          alt: "IN LABS",
          description:
            "AI-driven creative innovation: content, animation, video, visuals, and digital tools that push the limits of what's possible.",
        },
        inaudio: {
          alt: "IN AUDIO",
          description:
            "Music production, mixing, mastering, and event audio setup with the sound every project deserves.",
        },
        invisuals: {
          alt: "IN VISUALS",
          description:
            "Photography, video, graphic design, and animation for brands, events, editorials and more — everything visual, in one place.",
        },
      },
    },
    clients: {
      label: "Trusted By Global Innovators",
    },
    work: {
      heading: "Curated Fragments.",
      cta: "View All Work",
      yearLabel: "Year",
      yearValue: "2021—2024",
      focusLabel: "Focus",
      focusValue: "Web3, Audio, UX",
      projects: {
        obsidianEchoes: {
          title: "Obsidian Echoes",
          tag: "Spatial Audio / 2024",
        },
        monolithOs: {
          title: "Monolith OS",
          tag: "Digital Architecture / 2023",
        },
        liquidLogic: {
          title: "Liquid Logic",
          tag: "Visual Identity / 2024",
        },
        etherCore: {
          title: "Ether Core",
          tag: "Infrastructure / 2024",
        },
      },
    },
    footer: {
      connect: "Connect",
      contact: "Contact",
      tagline: "Inteligencia Natural",
      rights: "© 2024 IN Studio. All rights reserved.",
    },
  },
  es: {
    nav: {
      work: "Trabajos",
      studio: "Studio",
      audio: "Audio",
      labs: "Labs",
      contact: "Contacto",
      cta: "Contáctanos",
      menu: "Menú",
      close: "Cerrar",
      languageLabel: "Idioma",
    },
    hero: {
      eyebrow: "EST. 2024 — CURADURÍA DIGITAL",
      titleLine1: "INTELIGENCIA",
      titleLine2: "NATURAL",
      description:
        "Creamos soluciones visuales y logísticas con un ojo humano afinado y la potencia de la IA como aliada — juntos, hacemos lo extraordinario posible.",
      counter: "01/03",
    },
    ecosystem: {
      heading: "El Ecosistema",
      cards: {
        inlabs: {
          alt: "IN LABS",
          description:
            "Innovación creativa impulsada por IA: contenido, animación, video, visuales y herramientas digitales que empujan los límites de lo posible.",
        },
        inaudio: {
          alt: "IN AUDIO",
          description:
            "Producción musical, mezcla, master y montaje de audio para eventos con el sonido que cada proyecto merece.",
        },
        invisuals: {
          alt: "IN VISUALS",
          description:
            "Fotografía, video, diseño gráfico y animación para marcas, eventos, editoriales y más — todo lo visual, en un solo lugar.",
        },
      },
    },
    clients: {
      label: "La confianza de innovadores globales",
    },
    work: {
      heading: "Fragmentos Curados.",
      cta: "Ver Todo el Trabajo",
      yearLabel: "Año",
      yearValue: "2021—2024",
      focusLabel: "Enfoque",
      focusValue: "Web3, Audio, UX",
      projects: {
        obsidianEchoes: {
          title: "Ecos de Obsidiana",
          tag: "Audio Espacial / 2024",
        },
        monolithOs: {
          title: "Monolith OS",
          tag: "Arquitectura Digital / 2023",
        },
        liquidLogic: {
          title: "Lógica Líquida",
          tag: "Identidad Visual / 2024",
        },
        etherCore: {
          title: "Ether Core",
          tag: "Infraestructura / 2024",
        },
      },
    },
    footer: {
      connect: "Conectar",
      contact: "Contacto",
      tagline: "Inteligencia Natural",
      rights: "© 2024 IN Studio. Todos los derechos reservados.",
    },
  },
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Locale];
