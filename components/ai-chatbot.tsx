"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Declaraciones de tipos para Speech Recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Smile,
  Paperclip,
  Mic,
  MicOff,
  Phone,
  Video,
  FileText,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Search,
  Volume2,
  VolumeX,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "file" | "voice" | "image";
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isTyping?: boolean;
  reactions?: { thumbsUp: number; thumbsDown: number };
  userReaction?: "thumbsUp" | "thumbsDown" | null;
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
  href?: string;
  type: "link" | "download" | "schedule";
}

const predefinedQuestions = [
  "📋 ¿Qué documentos necesito para un testamento?",
  "💰 ¿Cuánto cuesta una compraventa?",
  "📅 ¿Cómo agendar una cita?",
  "📄 ¿Dónde puedo descargar formatos?",
  "🏢 ¿Qué servicios ofrecen?",
  "📊 ¿Tienen simulador de costos?",
  "📞 ¿Cuál es su horario de atención?",
  "👤 ¿Cómo accedo al portal del cliente?",
];

const emojiCategories = {
  faces: {
    name: "Smileys & emotion",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳",
      "😏",
      "😒",
      "😞",
      "😔",
      "😟",
      "😕",
      "🙁",
      "☹️",
      "😣",
      "😖",
      "😫",
      "😩",
      "🥺",
      "😢",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
      "🤯",
      "😳",
      "🥵",
      "🥶",
      "😱",
      "😨",
      "😰",
      "😥",
      "😓",
      "🤗",
      "🤔",
      "🤭",
      "🤫",
      "🤥",
      "😶",
      "😐",
      "😑",
      "😬",
      "🙄",
      "😯",
      "😦",
      "😧",
      "😮",
      "😲",
      "🥱",
      "😴",
      "🤤",
      "😪",
      "😵",
      "🤐",
      "🥴",
      "🤢",
      "🤮",
      "🤧",
      "😷",
      "🤒",
      "🤕",
      "🤑",
      "🤠",
      "😈",
      "👿",
      "👹",
      "👺",
      "🤡",
      "💩",
      "👻",
      "💀",
      "☠️",
      "👽",
      "👾",
      "🤖",
      "🎃",
      "😺",
      "😸",
      "😹",
      "😻",
      "😼",
      "😽",
      "🙀",
      "😿",
      "😾",
      "🙈",
      "🙉",
      "🙊",
      "💋",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👌",
      "🤏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝️",
      "👍",
      "👎",
      "👊",
      "✊",
      "🤛",
      "🤜",
      "👏",
      "🙌",
      "👐",
      "🤲",
      "🤝",
      "🙏",
      "✍️",
      "💅",
      "🤳",
      "💪",
      "🦾",
    ],
  },
  people: {
    name: "People & Body",
    emojis: [
      "👶",
      "🧒",
      "👦",
      "👧",
      "🧑",
      "👨",
      "👩",
      "🧓",
      "👴",
      "👵",
      "👱",
      "👱‍♂️",
      "👱‍♀️",
      "🧔",
      "👨‍🦰",
      "👩‍🦰",
      "👨‍🦱",
      "👩‍🦱",
      "👨‍🦳",
      "👩‍🦳",
      "👨‍🦲",
      "👩‍🦲",
      "🧑‍🦰",
      "🧑‍🦱",
      "🧑‍🦳",
      "🧑‍🦲",
      "👨‍⚕️",
      "👩‍⚕️",
      "🧑‍⚕️",
      "👨‍🎓",
      "👩‍🎓",
      "🧑‍🎓",
      "👨‍🏫",
      "👩‍🏫",
      "🧑‍🏫",
      "👨‍⚖️",
      "👩‍⚖️",
      "🧑‍⚖️",
      "👨‍🌾",
      "👩‍🌾",
      "🧑‍🌾",
      "👨‍💼",
      "👩‍💼",
      "🧑‍💼",
      "👨‍🔬",
      "👩‍🔬",
      "🧑‍🔬",
      "👨‍💻",
      "👩‍💻",
      "🧑‍💻",
      "👨‍🎤",
      "👩‍🎤",
      "🧑‍🎤",
      "👨‍🎨",
      "👩‍🎨",
      "🧑‍🎨",
      "👨‍✈️",
      "👩‍✈️",
      "🧑‍✈️",
      "👨‍🚀",
      "👩‍🚀",
      "🧑‍🚀",
      "👨‍🚒",
      "👩‍🚒",
      "🧑‍🚒",
      "👮",
      "👮‍♂️",
      "👮‍♀️",
      "🕵️",
      "🕵️‍♂️",
      "🕵️‍♀️",
      "💂",
      "💂‍♂️",
      "💂‍♀️",
      "🥷",
      "👷",
      "👷‍♂️",
      "👷‍♀️",
      "🤴",
      "👸",
      "👳",
      "👳‍♂️",
      "👳‍♀️",
      "👲",
      "🧕",
      "🤵",
      "👰",
      "🤰",
      "🤱",
      "👼",
      "🎅",
      "🤶",
      "🧑‍🎄",
      "🦸",
      "🦸‍♂️",
      "🦸‍♀️",
      "🦹",
      "🦹‍♂️",
      "🦹‍♀️",
      "🧙",
      "🧙‍♂️",
      "🧙‍♀️",
      "🧚",
      "🧚‍♂️",
      "🧚‍♀️",
      "🧛",
      "🧛‍♂️",
      "🧛‍♀️",
      "🧜",
      "🧜‍♂️",
      "🧜‍♀️",
      "🧝",
      "🧝‍♂️",
      "🧝‍♀️",
      "🧞",
      "🧞‍♂️",
      "🧞‍♀️",
      "🧟",
      "🧟‍♂️",
      "🧟‍♀️",
    ],
  },
  office: {
    name: "Office & Documents",
    emojis: [
      "📋",
      "📝",
      "📄",
      "📃",
      "📑",
      "📊",
      "📈",
      "📉",
      "📌",
      "📍",
      "📎",
      "🖇️",
      "📏",
      "📐",
      "✂️",
      "🗃️",
      "🗄️",
      "🗂️",
      "📂",
      "📁",
      "🗳️",
      "🗞️",
      "📰",
      "📓",
      "📔",
      "📒",
      "📕",
      "📗",
      "📘",
      "📙",
      "📚",
      "📖",
      "🔖",
      "🏷️",
      "💰",
      "💴",
      "💵",
      "💶",
      "💷",
      "💸",
      "💳",
      "🧾",
      "💹",
      "💱",
      "💲",
      "⚖️",
      "🔧",
      "🔨",
      "⚒️",
      "🛠️",
      "⛏️",
      "🔩",
      "⚙️",
      "🗜️",
      "⚗️",
      "🧪",
      "🧫",
      "🧬",
      "🔬",
      "🔭",
      "📡",
      "💻",
      "🖥️",
      "🖨️",
      "⌨️",
      "🖱️",
      "🖲️",
      "💽",
      "💾",
      "💿",
      "📀",
      "🧮",
      "🎥",
      "📷",
      "📸",
      "📹",
      "📼",
      "🔍",
      "🔎",
      "🕯️",
      "💡",
      "🔦",
      "🏮",
      "🪔",
      "📞",
      "☎️",
      "📟",
      "📠",
      "📧",
      "📨",
      "📩",
      "📤",
      "📥",
      "📦",
      "📫",
      "📪",
      "📬",
      "📭",
      "📮",
      "🗳️",
      "✉️",
      "💌",
      "📯",
      "📢",
      "📣",
      "📻",
      "📺",
      "🎬",
      "🎭",
      "🎨",
    ],
  },
  nature: {
    name: "Animals & Nature",
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐽",
      "🐸",
      "🐵",
      "🙈",
      "🙉",
      "🙊",
      "🐒",
      "🦍",
      "🦧",
      "🐕",
      "🐩",
      "🦮",
      "🐕‍🦺",
      "🐈",
      "🐈‍⬛",
      "🦄",
      "🐎",
      "🦓",
      "🦌",
      "🐂",
      "🐃",
      "🐄",
      "🐪",
      "🐫",
      "🦙",
      "🦒",
      "🐘",
      "🦏",
      "🦛",
      "🐐",
      "🐑",
      "🐏",
      "🐕",
      "🐩",
      "🦮",
      "🐕‍🦺",
      "🐈",
      "🐈‍⬛",
      "🦄",
      "🐎",
      "🦓",
      "🦌",
      "🐂",
      "🐃",
      "🐄",
      "🐪",
      "🐫",
      "🦙",
      "🦒",
      "🐘",
      "🦏",
      "🦛",
      "🐐",
      "🐑",
      "🐏",
      "🐕",
      "🐩",
      "🦮",
      "🐕‍🦺",
      "🐈",
      "🐈‍⬛",
      "🦄",
      "🐎",
      "🦓",
      "🦌",
      "🐂",
      "🐃",
      "🐄",
      "🐪",
      "🐫",
      "🦙",
      "🦒",
      "🐘",
      "🦏",
      "🦛",
      "🐐",
      "🐑",
      "🐏",
      "🐕",
      "🐩",
      "🦮",
      "🐕‍🦺",
      "🐈",
      "🐈‍⬛",
      "🦄",
      "🐎",
      "🦓",
      "🦌",
      "🐂",
      "🐃",
      "🐄",
      "🐪",
      "🐫",
      "🦙",
      "🦒",
      "🐘",
      "🦏",
      "🦛",
      "🐐",
      "🐑",
      "🐏",
      "🐕",
      "🐩",
      "🦮",
      "🐕‍🦺",
      "🐈",
      "🐈‍⬛",
    ],
  },
  food: {
    name: "Food & Drink",
    emojis: [
      "🍎",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
      "🌶️",
      "🫑",
      "🌽",
      "🥕",
      "🫒",
      "🧄",
      "🧅",
      "🥔",
      "🍠",
      "🥐",
      "🥖",
      "🍞",
      "🥨",
      "🥯",
      "🧀",
      "🥚",
      "🍳",
      "🧈",
      "🥞",
      "🧇",
      "🥓",
      "🥩",
      "🍗",
      "🍖",
      "🦴",
      "🌭",
      "🍔",
      "🍟",
      "🍕",
      "🥪",
      "🥙",
      "🧆",
      "🌮",
      "🌯",
      "🫔",
      "🥗",
      "🥘",
      "🫕",
      "🥫",
      "🍝",
      "🍜",
      "🍲",
      "🍛",
      "🍣",
      "🍱",
      "🥟",
      "🦪",
      "🍤",
      "🍙",
      "🍚",
      "🍘",
      "🍥",
      "🥠",
      "🥮",
      "🍢",
      "🍡",
      "🍧",
      "🍨",
      "🍦",
      "🥧",
      "🧁",
      "🍰",
      "🎂",
      "🍮",
      "🍭",
      "🍬",
      "🍫",
      "🍿",
      "🍩",
      "🍪",
      "🌰",
      "🥜",
      "🍯",
      "🥛",
      "🍼",
      "☕",
      "🫖",
      "🍵",
      "🧃",
      "🥤",
      "🧊",
      "🥢",
      "🍽️",
      "🍴",
      "🥄",
      "🔪",
      "🏺",
      "🌍",
      "🌎",
    ],
  },
  travel: {
    name: "Travel & Places",
    emojis: [
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🚎",
      "🏎️",
      "🚓",
      "🚑",
      "🚒",
      "🚐",
      "🛻",
      "🚚",
      "🚛",
      "🚜",
      "🏍️",
      "🛵",
      "🚲",
      "🛴",
      "🛹",
      "🛼",
      "🚁",
      "✈️",
      "🛩️",
      "🛫",
      "🛬",
      "🪂",
      "💺",
      "🚀",
      "🛸",
      "🚉",
      "🚊",
      "🚝",
      "🚞",
      "🚋",
      "🚃",
      "🚋",
      "🚞",
      "🚝",
      "🚄",
      "🚅",
      "🚈",
      "🚂",
      "🚆",
      "🚇",
      "🚊",
      "🚝",
      "🚞",
      "🚋",
      "🚃",
      "🚋",
      "🚞",
      "🚝",
      "🚄",
      "🚅",
      "🚈",
      "🚂",
      "🚆",
      "🚇",
      "🚊",
      "🚝",
      "🚞",
      "🚋",
      "🚃",
      "🚋",
      "🚞",
      "🚝",
      "🚄",
      "🚅",
      "🚈",
      "🚂",
      "🚆",
      "🚇",
      "🚊",
      "🚝",
      "🚞",
      "🚋",
      "🚃",
      "🚋",
      "🚞",
      "🚝",
      "🚄",
      "🚅",
      "🚈",
      "🚂",
      "🚆",
      "🚇",
      "🚊",
      "🚝",
      "🚞",
      "🚋",
      "🚃",
      "🚋",
      "🚞",
      "🚝",
      "🚄",
      "🚅",
      "🚈",
      "🚂",
      "🚆",
      "🚇",
      "🚊",
      "🚝",
      "🚞",
      "🚋",
      "🚃",
      "🚋",
      "🚞",
      "🚝",
      "🚄",
      "🚅",
      "🚈",
      "🚂",
      "🚆",
      "🚇",
      "🚊",
      "🚝",
      "🚞",
      "🚋",
      "🚃",
      "🚋",
    ],
  },
};

const emojiSuggestions = Object.values(emojiCategories).flatMap(
  (category) => category.emojis
);

const botResponses: Record<
  string,
  { text: string; quickActions?: QuickAction[] }
> = {
  testamento: {
    text: "Para elaborar un testamento necesitas algunos documentos básicos como identificación oficial vigente, tu CURP, comprobante de domicilio y las escrituras si tienes bienes inmuebles. El costo varía según el valor de tus bienes. ¿Te gustaría agendar una consulta gratuita para que te explique todo el proceso?",
    quickActions: [
      {
        label: "📅 Agendar Cita",
        action: "Agendar consulta para testamento",
        href: "/citas",
        type: "schedule",
      },
      {
        label: "💰 Cotizar Costo",
        action: "Ver simulador de costos",
        href: "/simulador",
        type: "link",
      },
      {
        label: "📄 Ver Formatos",
        action: "Descargar documentos necesarios",
        href: "/formatos",
        type: "download",
      },
    ],
  },
  compraventa: {
    text: "El costo de una compraventa incluye varios conceptos como honorarios notariales, impuestos como ISR e IVA, gastos de registro, avalúos y búsquedas. ¿Necesitas más información específica sobre algún concepto en particular?",
    quickActions: [
      {
        label: "💰 Cotizar Costo",
        action: "Ver simulador de aranceles",
        href: "/simulador",
        type: "link",
      },
      {
        label: "📅 Agendar Cita",
        action: "Consulta especializada",
        href: "/citas",
        type: "schedule",
      },
      {
        label: "📄 Ver Formatos",
        action: "Documentos requeridos",
        href: "/formatos",
        type: "download",
      },
    ],
  },
  cita: {
    text: "Puedes agendar tu cita de tres formas diferentes. La más conveniente es a través de nuestro sistema en línea que está disponible las 24 horas del día. También puedes llamarnos al (664) 123-4567 o visitar nuestras oficinas directamente. Nuestro horario es de lunes a viernes de 9:00 a 18:00. ¿Prefieres que te ayude a agendar ahora mismo?",
    quickActions: [
      {
        label: "📅 Agendar Cita Online",
        action: "Abrir sistema de citas",
        href: "/citas",
        type: "schedule",
      },
      {
        label: "📞 Llamar Ahora",
        action: "Llamar para agendar",
        href: "tel:+526641234567",
        type: "link",
      },
      {
        label: "📍 Ver Ubicación",
        action: "Ver dirección y mapa",
        href: "/contacto",
        type: "link",
      },
    ],
  },
  poderes: {
    text: "Tenemos diferentes tipos de poderes disponibles. El poder general te da facultades amplias, el especial es para actos específicos, y el de pleitos y cobranzas es para representación legal. Cada uno tiene diferentes alcances y costos. ¿Para qué necesitas el poder específicamente?",
    quickActions: [
      {
        label: "📜 Ver Formatos",
        action: "Documentos necesarios",
        href: "/formatos",
        type: "download",
      },
      {
        label: "💰 Cotizar Costo",
        action: "Simulador de costos",
        href: "/simulador",
        type: "link",
      },
      {
        label: "📅 Agendar Cita",
        action: "Consulta personalizada",
        href: "/citas",
        type: "schedule",
      },
    ],
  },
  tiempo: {
    text: "Los tiempos estimados varían según el trámite. Los testamentos y poderes generalmente se pueden completar en 1 a 2 días, mientras que las compraventas pueden tomar entre 15 a 30 días hábiles debido a los trámites adicionales. Trabajamos para agilizar todos los procesos manteniendo la seguridad jurídica.",
    quickActions: [
      {
        label: "📅 Agendar Cita",
        action: "Consulta sobre tiempos",
        href: "/citas",
        type: "schedule",
      },
      {
        label: "👤 Portal Cliente",
        action: "Seguimiento de trámites",
        href: "/portal-cliente",
        type: "link",
      },
      {
        label: "📞 Llamar",
        action: "Información específica",
        href: "tel:+526641234567",
        type: "link",
      },
    ],
  },
  horario: {
    text: "Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM, los sábados de 9:00 AM a 2:00 PM, y cerramos los domingos. Puedes contactarnos al teléfono (664) 123-4567 o por email a info@notaria3tijuana.com.",
    quickActions: [
      {
        label: "📅 Agendar Cita",
        action: "Sistema en línea",
        href: "/citas",
        type: "schedule",
      },
      {
        label: "📍 Ver Ubicación",
        action: "Dirección y mapa",
        href: "/contacto",
        type: "link",
      },
      {
        label: "📞 Llamar Ahora",
        action: "Contacto directo",
        href: "tel:+526641234567",
        type: "link",
      },
    ],
  },
  formatos: {
    text: "Tenemos formatos y documentos disponibles para diferentes trámites como testamentos, poderes, compraventas y sociedades. ¿Qué tipo de formato necesitas específicamente?",
    quickActions: [
      {
        label: "📄 Ver Todos los Formatos",
        action: "Acceder a formatos disponibles",
        href: "/formatos",
        type: "download",
      },
      {
        label: "📋 Formato Testamento",
        action: "Descargar formato de testamento",
        href: "/formatos?tipo=testamento",
        type: "download",
      },
      {
        label: "📜 Formato Poder",
        action: "Descargar formato de poder",
        href: "/formatos?tipo=poder",
        type: "download",
      },
      {
        label: "🏠 Formato Compraventa",
        action: "Descargar formato de compraventa",
        href: "/formatos?tipo=compraventa",
        type: "download",
      },
    ],
  },
  "formato-testamento": {
    text: "Perfecto, aquí tienes el formato de testamento. Este documento incluye los datos del testador, declaración de bienes, designación de herederos y cláusulas especiales. Te recomiendo completar el formato y agendar una cita para su protocolización.",
    quickActions: [
      {
        label: "📄 Descargar Formato",
        action: "Descargar formato de testamento",
        href: "/api/download/testamento.pdf",
        type: "download",
      },
      {
        label: "📅 Agendar Cita",
        action: "Agendar cita para protocolizar",
        href: "/citas",
        type: "schedule",
      },
    ],
  },
  "formato-compraventa": {
    text: "Excelente, aquí tienes el formato de compraventa. Este documento incluye los datos del vendedor y comprador, descripción del inmueble, precio y condiciones de pago, y las obligaciones de las partes. Te recomiendo completar el formato y agendar una cita para su protocolización.",
    quickActions: [
      {
        label: "📄 Descargar Formato",
        action: "Descargar formato de compraventa",
        href: "/api/download/compraventa.pdf",
        type: "download",
      },
      {
        label: "📅 Agendar Cita",
        action: "Agendar cita para protocolizar",
        href: "/citas",
        type: "schedule",
      },
    ],
  },
  "formato-poder": {
    text: "Perfecto, aquí tienes el formato de poder. Este documento incluye los datos del poderdante y apoderado, el tipo de poder (general o especial), las facultades específicas, y la vigencia y limitaciones. Te recomiendo completar el formato y agendar una cita para su protocolización.",
    quickActions: [
      {
        label: "📄 Descargar Formato",
        action: "Descargar formato de poder",
        href: "/api/download/poder.pdf",
        type: "download",
      },
      {
        label: "📅 Agendar Cita",
        action: "Agendar cita para protocolizar",
        href: "/citas",
        type: "schedule",
      },
    ],
  },
  simulador: {
    text: "Tenemos un simulador de aranceles y costos que calcula el costo aproximado de testamentos, compraventas, poderes, sociedades y otros trámites. ¿Qué trámite específico quieres cotizar?",
    quickActions: [
      {
        label: "💰 Abrir Simulador",
        action: "Acceder al simulador de aranceles",
        href: "/simulador",
        type: "link",
      },
      {
        label: "📅 Cotización Personalizada",
        action: "Agendar cita para cotización",
        href: "/citas",
        type: "schedule",
      },
      {
        label: "📞 Llamar para Cotizar",
        action: "Llamar para cotización",
        href: "tel:+526641234567",
        type: "link",
      },
    ],
  },
  servicios: {
    text: "Ofrecemos diversos servicios notariales como testamentos y sucesiones, compraventa de bienes inmuebles, poderes notariales, constitución de sociedades, actos familiares, y certificaciones y legalizaciones. ¿Qué servicio específico te interesa?",
    quickActions: [
      {
        label: "🏢 Ver Servicios",
        action: "Información detallada de servicios",
        href: "/servicios",
        type: "link",
      },
      {
        label: "💰 Cotizar Costo",
        action: "Simulador de aranceles",
        href: "/simulador",
        type: "link",
      },
      {
        label: "📅 Agendar Cita",
        action: "Consulta especializada",
        href: "/citas",
        type: "schedule",
      },
    ],
  },
  contacto: {
    text: "Nuestra información de contacto es la siguiente: estamos ubicados en Av. Revolución 1234, Zona Centro, Tijuana, B.C. 22000. Puedes llamarnos al (664) 123-4567 o escribirnos a info@notaria3tijuana.com. Nuestro horario es de lunes a viernes de 9:00 AM a 6:00 PM y sábados de 9:00 AM a 2:00 PM.",
    quickActions: [
      {
        label: "📞 Llamar Ahora",
        action: "Llamar directamente",
        href: "tel:+526641234567",
        type: "link",
      },
      {
        label: "📧 Enviar Email",
        action: "Enviar correo electrónico",
        href: "mailto:info@notaria3tijuana.com",
        type: "link",
      },
      {
        label: "📍 Ver Ubicación",
        action: "Ver mapa y direcciones",
        href: "/contacto",
        type: "link",
      },
    ],
  },
  blog: {
    text: "Tenemos un blog educativo con artículos sobre derecho notarial, trámites y procedimientos, noticias legales y consejos útiles. ¿Sobre qué tema específico te gustaría leer?",
    quickActions: [
      {
        label: "📚 Ver Blog",
        action: "Acceder al blog educativo",
        href: "/blog",
        type: "link",
      },
      {
        label: "📅 Agendar Cita",
        action: "Consulta personalizada",
        href: "/citas",
        type: "schedule",
      },
      {
        label: "📞 Contactar",
        action: "Hablar con un experto",
        href: "tel:+526641234567",
        type: "link",
      },
    ],
  },
  portal: {
    text: "El portal del cliente te da acceso al seguimiento de trámites, documentos digitales, historial de servicios y comunicaciones. ¿Necesitas ayuda para acceder al portal?",
    quickActions: [
      {
        label: "👤 Acceder Portal",
        action: "Portal del cliente",
        href: "/portal-cliente",
        type: "link",
      },
      {
        label: "📞 Soporte Técnico",
        action: "Ayuda para acceder",
        href: "tel:+526641234567",
        type: "link",
      },
      {
        label: "📅 Agendar Cita",
        action: "Si necesitas ayuda",
        href: "/citas",
        type: "schedule",
      },
    ],
  },
  default: {
    text: "Gracias por tu pregunta. Para brindarte la mejor respuesta, te recomiendo contactarnos directamente al teléfono (664) 123-4567 o por email a info@notaria3tijuana.com. ¿Hay algo más en lo que pueda ayudarte?",
    quickActions: [
      {
        label: "🏢 Ver Servicios",
        action: "Información completa",
        href: "/servicios",
        type: "link",
      },
      {
        label: "📅 Agendar Cita",
        action: "Consulta gratuita",
        href: "/citas",
        type: "schedule",
      },
      {
        label: "📞 Llamar Ahora",
        action: "Contacto directo",
        href: "tel:+526641234567",
        type: "link",
      },
    ],
  },
};

export function AIChatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy el asistente virtual de Notaría Pública No. 3. Estoy aquí para ayudarte con información sobre nuestros servicios notariales, agendar citas, descargar formatos o cualquier consulta que tengas. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
      reactions: { thumbsUp: 0, thumbsDown: 0 },
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState("");
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState("faces");
  const [recognition, setRecognition] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<any>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar Speech Recognition y Speech Synthesis
  useEffect(() => {
    // Inicializar Speech Recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "es-ES"; // Español
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          setInputMessage(finalTranscript);
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Error de reconocimiento de voz:", event.error);
        setIsListening(false);
        setIsRecording(false);

        // Mostrar mensaje de error al usuario
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: `❌ Error en el reconocimiento de voz: ${event.error}. Por favor, intenta escribir tu mensaje.`,
          sender: "bot",
          timestamp: new Date(),
          reactions: { thumbsUp: 0, thumbsDown: 0 },
        };
        setMessages((prev) => [...prev, errorMessage]);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
      recognitionRef.current = recognitionInstance;
    } else {
      console.warn("Speech Recognition no está soportado en este navegador");
    }

    // Inicializar Speech Synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis);

      // Cargar voces cuando estén disponibles
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log(
          "Voces disponibles:",
          voices.map((v) => v.name + " (" + v.lang + ")")
        );
      };

      // Cargar voces inmediatamente si ya están disponibles
      loadVoices();

      // También cargar cuando cambien las voces
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Función para hablar el texto del bot de forma más natural
  const speakText = (text: string) => {
    if (!speechSynthesis) return;

    // Detener cualquier síntesis en curso
    speechSynthesis.cancel();

    // Limpiar el texto para que suene más natural
    const cleanText = text
      .replace(/[📋📜🏠💰📅📞📍📧🕘📄📊👤🔐📚🤖]/g, "") // Remover emojis
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remover markdown bold
      .replace(/\n\n/g, ". ") // Convertir saltos de línea en pausas naturales
      .replace(/\n/g, ", ") // Convertir saltos de línea en pausas
      .replace(/•/g, "") // Remover bullets
      .replace(/\s+/g, " ") // Limpiar espacios múltiples
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "es-ES";
    utterance.rate = 0.9; // Velocidad natural
    utterance.pitch = 1.0; // Pitch normal (ni muy alto ni muy bajo)
    utterance.volume = 0.9;

    // Seleccionar la mejor voz disponible
    const voices = speechSynthesis.getVoices();

    // Buscar voces en español, priorizando calidad
    const spanishVoices = voices.filter(
      (voice: any) =>
        voice.lang.startsWith("es") || voice.lang.includes("Spanish")
    );

    if (spanishVoices.length > 0) {
      // Priorizar voces de calidad (Google, Microsoft, etc.)
      const preferredVoice =
        spanishVoices.find(
          (voice: any) =>
            voice.name.toLowerCase().includes("google") ||
            voice.name.toLowerCase().includes("microsoft") ||
            voice.name.toLowerCase().includes("español") ||
            voice.name.toLowerCase().includes("mexican")
        ) || spanishVoices[0]; // Usar la primera disponible si no hay preferida

      utterance.voice = preferredVoice;

      // Configurar pitch según el tipo de voz
      if (
        preferredVoice.name.toLowerCase().includes("female") ||
        preferredVoice.name.toLowerCase().includes("mujer") ||
        preferredVoice.name.toLowerCase().includes("maria")
      ) {
        utterance.pitch = 1.1; // Ligeramente más alto para voz femenina
        console.log("Usando voz femenina:", preferredVoice.name);
      } else {
        utterance.pitch = 0.9; // Ligeramente más bajo para voz masculina
        console.log("Usando voz masculina:", preferredVoice.name);
      }
    } else {
      // Si no hay voces en español, usar configuración neutral
      utterance.pitch = 1.0;
      utterance.rate = 0.9;
      console.log(
        "No se encontraron voces en español, usando configuración por defecto"
      );
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const generateBotResponse = async (
    userMessage: string
  ): Promise<{ text: string; quickActions?: QuickAction[] }> => {
    const message = userMessage.toLowerCase();

    // Detectar solicitudes específicas de formatos primero
    if (
      (message.includes("formato") ||
        message.includes("descargar") ||
        message.includes("documento")) &&
      (message.includes("testamento") || message.includes("testar"))
    ) {
      return botResponses["formato-testamento"];
    }

    if (
      (message.includes("formato") ||
        message.includes("descargar") ||
        message.includes("documento")) &&
      (message.includes("compraventa") ||
        message.includes("compra") ||
        message.includes("venta"))
    ) {
      return botResponses["formato-compraventa"];
    }

    if (
      (message.includes("formato") ||
        message.includes("descargar") ||
        message.includes("documento")) &&
      (message.includes("poder") || message.includes("apoderado"))
    ) {
      return botResponses["formato-poder"];
    }

    // Detectar palabras clave mejoradas
    if (
      message.includes("testamento") ||
      message.includes("testar") ||
      message.includes("sucesión") ||
      message.includes("herencia")
    ) {
      return botResponses.testamento;
    }
    if (
      message.includes("compraventa") ||
      message.includes("compra") ||
      message.includes("venta") ||
      message.includes("inmueble") ||
      message.includes("casa") ||
      message.includes("terreno")
    ) {
      return botResponses.compraventa;
    }
    if (
      message.includes("cita") ||
      message.includes("agendar") ||
      message.includes("reservar") ||
      message.includes("consulta") ||
      message.includes("visita")
    ) {
      return botResponses.cita;
    }
    if (
      message.includes("poder") ||
      message.includes("poderes") ||
      message.includes("representación")
    ) {
      return botResponses.poderes;
    }
    if (
      message.includes("tiempo") ||
      message.includes("días") ||
      message.includes("duración") ||
      message.includes("cuándo") ||
      message.includes("demora")
    ) {
      return botResponses.tiempo;
    }
    if (
      message.includes("horario") ||
      message.includes("atención") ||
      message.includes("abierto") ||
      message.includes("hora") ||
      message.includes("cuándo abren")
    ) {
      return botResponses.horario;
    }
    if (
      message.includes("formato") ||
      message.includes("documento") ||
      message.includes("descargar") ||
      message.includes("formulario") ||
      message.includes("papel")
    ) {
      return botResponses.formatos;
    }
    if (
      message.includes("simulador") ||
      message.includes("costo") ||
      message.includes("precio") ||
      message.includes("cotización") ||
      message.includes("cuánto cuesta") ||
      message.includes("arancel")
    ) {
      return botResponses.simulador;
    }
    if (
      message.includes("servicio") ||
      message.includes("servicios") ||
      message.includes("trámite") ||
      message.includes("tramites") ||
      message.includes("qué hacen") ||
      message.includes("qué ofrecen")
    ) {
      return botResponses.servicios;
    }
    if (
      message.includes("contacto") ||
      message.includes("teléfono") ||
      message.includes("dirección") ||
      message.includes("ubicación") ||
      message.includes("dónde están") ||
      message.includes("cómo contactar")
    ) {
      return botResponses.contacto;
    }
    if (
      message.includes("blog") ||
      message.includes("artículo") ||
      message.includes("noticia") ||
      message.includes("información") ||
      message.includes("leer") ||
      message.includes("consejo")
    ) {
      return botResponses.blog;
    }
    if (
      message.includes("portal") ||
      message.includes("cliente") ||
      message.includes("acceso") ||
      message.includes("seguimiento") ||
      message.includes("mis documentos") ||
      message.includes("mi cuenta")
    ) {
      return botResponses.portal;
    }

    // Si no coincide con ninguna respuesta predefinida, usar Gemini
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          text: data.response,
          quickActions: [
            {
              label: "📅 Agendar Cita",
              action: "Consulta gratuita",
              href: "/citas",
              type: "schedule",
            },
            {
              label: "📞 Llamar Ahora",
              action: "Contacto directo",
              href: "tel:+526641234567",
              type: "link",
            },
          ],
        };
      }
    } catch (error) {
      console.error("Error al llamar a Gemini:", error);
    }

    return botResponses.default;
  };

  const addEmojiToMessage = (emoji: string) => {
    setInputMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 Archivo: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
        type: "file",
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      };
      setMessages((prev) => [...prev, fileMessage]);

      // Simular respuesta del bot
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `📄 He recibido tu archivo "${file.name}". Nuestro equipo lo revisará y te contactaremos pronto. ¿Necesitas ayuda con algo más?`,
          sender: "bot",
          timestamp: new Date(),
          reactions: { thumbsUp: 0, thumbsDown: 0 },
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1500);
    }
  };

  const toggleReaction = (
    messageId: string,
    reaction: "thumbsUp" | "thumbsDown"
  ) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const currentReaction = msg.userReaction;
          const newReaction = currentReaction === reaction ? null : reaction;

          return {
            ...msg,
            userReaction: newReaction,
            reactions: {
              thumbsUp:
                msg.reactions?.thumbsUp ||
                0 +
                  (newReaction === "thumbsUp"
                    ? 1
                    : currentReaction === "thumbsUp"
                    ? -1
                    : 0),
              thumbsDown:
                msg.reactions?.thumbsDown ||
                0 +
                  (newReaction === "thumbsDown"
                    ? 1
                    : currentReaction === "thumbsDown"
                    ? -1
                    : 0),
            },
          };
        }
        return msg;
      })
    );
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking with typing indicator
    const thinkingTime = 1500 + Math.random() * 1000;

    setTimeout(async () => {
      const response = await generateBotResponse(text);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
        reactions: { thumbsUp: 0, thumbsDown: 0 },
        quickActions: response.quickActions,
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);

      // Hablar la respuesta del bot
      speakText(response.text);
    }, thinkingTime);
  };

  const startVoiceRecording = () => {
    if (!recognitionRef.current) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "❌ El reconocimiento de voz no está disponible en tu navegador. Por favor, escribe tu mensaje.",
        sender: "bot",
        timestamp: new Date(),
        reactions: { thumbsUp: 0, thumbsDown: 0 },
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    if (isListening) {
      // Si ya está escuchando, detener
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
      return;
    }

    setIsRecording(true);
    setTranscript("");
    recognitionRef.current.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  // Función para procesar mensajes y convertir enlaces en componentes clickeables
  const processMessageWithLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Agregar texto antes del enlace
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Agregar el enlace como componente
      parts.push(
        <Link
          key={match.index}
          href={match[2]}
          className="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {match[1]}
        </Link>
      );

      lastIndex = match.index + match[0].length;
    }

    // Agregar texto restante
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Cerrar emoji picker al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-xl"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      ref={chatRef}
      className={`fixed bottom-6 right-6 z-50 w-[500px] shadow-2xl border-border transition-all duration-300 ${
        isMinimized ? "h-16" : "h-[700px]"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-white border-b border-slate-200 rounded-t-lg">
        <CardTitle className="text-lg font-semibold flex items-center gap-3 text-slate-800">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </div>
          <span>Asistente Notaria 3</span>
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-600 hover:bg-slate-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-600 hover:bg-slate-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[580px] bg-slate-50">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent bg-gradient-to-b from-slate-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[80%]">
                  <div
                    className={`rounded-2xl p-4 text-sm ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-8 shadow-md"
                        : "bg-white text-slate-800 mr-8 shadow-sm border border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {message.sender === "bot" && (
                        <div className="relative flex-shrink-0">
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-slate-600" />
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {processMessageWithLinks(message.text)}
                        </div>
                        {message.type === "file" && (
                          <div className="mt-3 flex items-center gap-2 text-xs bg-slate-50 px-2 py-1 rounded-md">
                            <FileText className="h-3 w-3 text-slate-500" />
                            <span className="text-slate-600">
                              {message.fileName}
                            </span>
                            <span className="text-slate-400">
                              ({message.fileSize})
                            </span>
                          </div>
                        )}
                        {message.type === "voice" && (
                          <div className="mt-3 flex items-center gap-2 text-xs bg-slate-50 px-2 py-1 rounded-md">
                            <Mic className="h-3 w-3 text-slate-500" />
                            <span className="text-slate-600">
                              Mensaje de voz
                            </span>
                          </div>
                        )}
                      </div>
                      {message.sender === "user" && (
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions for bot messages */}
                  {message.sender === "bot" && message.quickActions && (
                    <div className="mt-3 ml-11">
                      <div className="text-xs text-slate-500 mb-2">
                        Acciones rápidas:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.quickActions.map((action, index) => {
                          // Determinar si es un enlace externo (tel:, mailto:) o interno
                          const isExternalLink =
                            action.href?.startsWith("tel:") ||
                            action.href?.startsWith("mailto:");
                          const isDownloadLink = action.type === "download";

                          if (isExternalLink || isDownloadLink) {
                            // Para enlaces externos y descargas, usar enlace normal
                            return (
                              <a
                                key={index}
                                href={action.href || "#"}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                target={isExternalLink ? "_self" : "_blank"}
                                rel={
                                  isExternalLink ? "" : "noopener noreferrer"
                                }
                              >
                                {action.label}
                              </a>
                            );
                          } else {
                            // Para enlaces internos, usar router.push para navegación sin recargar
                            return (
                              <button
                                key={index}
                                onClick={async () => {
                                  if (action.href) {
                                    setIsNavigating(true);

                                    // Agregar mensaje informativo al chat
                                    const navigationMessage: Message = {
                                      id: Date.now().toString(),
                                      text: `Te estoy llevando a ${action.label.toLowerCase()}. Puedes volver al chat en cualquier momento usando el botón del chatbot.`,
                                      sender: "bot",
                                      timestamp: new Date(),
                                      reactions: { thumbsUp: 0, thumbsDown: 0 },
                                    };
                                    setMessages((prev) => [
                                      ...prev,
                                      navigationMessage,
                                    ]);

                                    try {
                                      // Usar router.push para navegación suave sin recargar la página
                                      await router.push(action.href);
                                    } catch (error) {
                                      console.error(
                                        "Error de navegación:",
                                        error
                                      );
                                    } finally {
                                      setIsNavigating(false);
                                    }
                                  }
                                }}
                                disabled={isNavigating}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors border cursor-pointer ${
                                  isNavigating
                                    ? "bg-blue-100 text-blue-600 border-blue-300"
                                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                                }`}
                              >
                                {isNavigating ? (
                                  <>
                                    <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    Navegando...
                                  </>
                                ) : (
                                  action.label
                                )}
                              </button>
                            );
                          }
                        })}
                      </div>
                    </div>
                  )}

                  {/* Reactions for bot messages */}
                  {message.sender === "bot" && message.reactions && (
                    <div className="flex items-center gap-2 mt-2 ml-11">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 text-xs hover:bg-emerald-50"
                        onClick={() => toggleReaction(message.id, "thumbsUp")}
                      >
                        <ThumbsUp
                          className={`h-3 w-3 mr-1 ${
                            message.userReaction === "thumbsUp"
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        />
                        {message.reactions.thumbsUp > 0 &&
                          message.reactions.thumbsUp}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 text-xs hover:bg-red-50"
                        onClick={() => toggleReaction(message.id, "thumbsDown")}
                      >
                        <ThumbsDown
                          className={`h-3 w-3 mr-1 ${
                            message.userReaction === "thumbsDown"
                              ? "text-red-600"
                              : "text-slate-400"
                          }`}
                        />
                        {message.reactions.thumbsDown > 0 &&
                          message.reactions.thumbsDown}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 text-xs hover:bg-slate-50"
                        onClick={() =>
                          navigator.clipboard.writeText(message.text)
                        }
                        title="Copiar mensaje"
                      >
                        <Copy className="h-3 w-3 text-slate-400" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg p-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="h-3 w-3" />
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <div className="text-sm font-medium text-slate-700 mb-2">
                💡 Preguntas frecuentes
              </div>
              <div className="space-y-1">
                {predefinedQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left text-xs h-auto p-2 hover:bg-white hover:shadow-sm border border-slate-200"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    <span className="truncate">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-200 bg-gradient-to-r from-white to-slate-50">
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="mb-4 bg-white rounded-xl border border-slate-200 shadow-xl max-h-96 w-full"
              >
                {/* Search Bar */}
                <div className="p-3 border-b border-slate-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search emojis..."
                      value={emojiSearch}
                      onChange={(e) => setEmojiSearch(e.target.value)}
                      className="pl-10 pr-4 h-10 border-slate-300 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="flex border-b border-slate-200 overflow-x-auto">
                  {Object.entries(emojiCategories).map(([key, category]) => (
                    <Button
                      key={key}
                      variant="ghost"
                      size="sm"
                      className={`px-4 py-2 text-xs whitespace-nowrap rounded-none border-b-2 ${
                        selectedEmojiCategory === key
                          ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                          : "border-transparent text-slate-600 hover:text-slate-800"
                      }`}
                      onClick={() => setSelectedEmojiCategory(key)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>

                {/* Emoji Grid */}
                <div className="p-4 max-h-64 overflow-y-auto">
                  <div className="text-sm font-medium text-slate-700 mb-3">
                    {
                      emojiCategories[
                        selectedEmojiCategory as keyof typeof emojiCategories
                      ]?.name
                    }
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {emojiCategories[
                      selectedEmojiCategory as keyof typeof emojiCategories
                    ]?.emojis
                      .filter(
                        (emoji) =>
                          emojiSearch === "" ||
                          emoji
                            .toLowerCase()
                            .includes(emojiSearch.toLowerCase())
                      )
                      .map((emoji, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 text-lg hover:bg-slate-100 hover:scale-110 transition-all duration-200 rounded-lg"
                          onClick={() => addEmojiToMessage(emoji)}
                          title={emoji}
                        >
                          {emoji}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Input en una sola fila horizontal */}
            <div className="flex gap-2 items-center bg-white rounded-lg border border-slate-200 p-2 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className={`h-10 w-10 transition-all duration-200 ${
                  isRecording || isListening
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  startVoiceRecording();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                title={
                  isRecording || isListening
                    ? "Detener grabación"
                    : "Grabar mensaje de voz"
                }
              >
                {isRecording || isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isSpeaking) {
                    speechSynthesis?.cancel();
                    setIsSpeaking(false);
                  } else {
                    const lastBotMessage = messages
                      .filter((m) => m.sender === "bot")
                      .slice(-1)[0];
                    if (lastBotMessage) {
                      speakText(lastBotMessage.text);
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                disabled={isTyping}
                className={`h-10 w-10 transition-all duration-200 ${
                  isSpeaking
                    ? "bg-green-100 text-green-600 animate-pulse"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                title={isSpeaking ? "Detener audio" : "Repetir último mensaje"}
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Input
                placeholder={
                  isRecording || isListening
                    ? "🎤 Escuchando..."
                    : "Escribe tu mensaje..."
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (inputMessage.trim() && !isRecording && !isListening) {
                      sendMessage(inputMessage);
                    }
                  }
                }}
                className="flex-1 h-10 border-0 focus:ring-0 focus:outline-none text-sm bg-transparent"
                disabled={isRecording || isListening}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-600 hover:bg-slate-100"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Emojis"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={() => sendMessage(inputMessage)}
                disabled={
                  !inputMessage.trim() || isTyping || isRecording || isListening
                }
                className="h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white disabled:bg-slate-300 disabled:text-slate-500 transition-colors"
                title="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Hidden file input */}
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
