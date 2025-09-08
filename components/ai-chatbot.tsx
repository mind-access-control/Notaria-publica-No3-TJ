"use client";

import { useState, useRef, useEffect } from "react";

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
}

const predefinedQuestions = [
  "📋 ¿Qué documentos necesito para un testamento?",
  "💰 ¿Cuánto cuesta una compraventa?",
  "📅 ¿Cómo agendar una cita?",
  "📜 ¿Qué tipos de poderes existen?",
  "⏰ ¿Cuánto tiempo toma una escrituración?",
  "🏠 ¿Cómo funciona la compraventa?",
  "👥 ¿Puedo hacer un testamento conjunto?",
  "📞 ¿Cuál es su horario de atención?",
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

const botResponses: Record<string, string> = {
  testamento:
    "📋 Para elaborar un testamento necesitas:\n\n✅ Identificación oficial vigente\n✅ CURP\n✅ Comprobante de domicilio\n✅ Escrituras (si hay bienes inmuebles)\n\n💰 El costo varía según el valor de los bienes.\n\n📅 ¿Te gustaría agendar una consulta gratuita?",
  compraventa:
    "🏠 El costo de una compraventa incluye:\n\n💰 Honorarios notariales\n💰 Impuestos (ISR, IVA)\n💰 Gastos de registro\n💰 Avalúos y búsquedas\n\n📊 Usa nuestro simulador de aranceles para una cotización aproximada.\n\n❓ ¿Necesitas más información específica?",
  cita: "📅 Puedes agendar tu cita de tres formas:\n\n1️⃣ Sistema en línea (24/7)\n2️⃣ Teléfono: (664) 123-4567\n3️⃣ Visita nuestras oficinas\n\n⏰ Horario: Lunes a Viernes 9:00-18:00\n\n🤝 ¿Prefieres que te ayude a agendar ahora?",
  poderes:
    "📜 Tipos de poderes disponibles:\n\n🔹 General: Facultades amplias\n🔹 Especial: Actos específicos\n🔹 Pleitos y Cobranzas: Representación legal\n\n💰 Cada uno tiene diferentes alcances y costos.\n\n❓ ¿Para qué necesitas el poder?",
  tiempo:
    "⏰ Tiempos estimados por trámite:\n\n📋 Testamentos: 1-2 días\n📜 Poderes: 1-2 días\n🏠 Compraventas: 15-30 días hábiles\n\n⚡ Trabajamos para agilizar todos los procesos manteniendo la seguridad jurídica.",
  horario:
    "🕘 Nuestro horario de atención:\n\n📅 Lunes a Viernes: 9:00 AM - 6:00 PM\n📅 Sábados: 9:00 AM - 2:00 PM\n📅 Domingos: Cerrado\n\n📞 Teléfono: (664) 123-4567\n📧 Email: info@notaria3tijuana.com",
  default:
    "🤖 Gracias por tu pregunta. Para brindarte la mejor respuesta, te recomiendo:\n\n👨‍💼 Contactar a nuestro equipo de expertos\n📅 Agendar una consulta gratuita\n📞 Llamarnos al (664) 123-4567\n\n❓ ¿Hay algo más en lo que pueda ayudarte?",
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 ¡Hola! Soy el asistente virtual de Notaría Pública No. 3. ¿En qué puedo ayudarte hoy?",
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

  // Inicializar Speech Recognition
  useEffect(() => {
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

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Detectar palabras clave mejoradas
    if (message.includes("testamento") || message.includes("testar")) {
      return botResponses.testamento;
    }
    if (
      message.includes("compraventa") ||
      message.includes("compra") ||
      message.includes("venta")
    ) {
      return botResponses.compraventa;
    }
    if (
      message.includes("cita") ||
      message.includes("agendar") ||
      message.includes("reservar")
    ) {
      return botResponses.cita;
    }
    if (message.includes("poder") || message.includes("poderes")) {
      return botResponses.poderes;
    }
    if (
      message.includes("tiempo") ||
      message.includes("días") ||
      message.includes("duración")
    ) {
      return botResponses.tiempo;
    }
    if (
      message.includes("horario") ||
      message.includes("atención") ||
      message.includes("abierto")
    ) {
      return botResponses.horario;
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

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(text),
        sender: "bot",
        timestamp: new Date(),
        reactions: { thumbsUp: 0, thumbsDown: 0 },
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
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
                          {message.text}
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
                className={`h-10 w-10 transition-all duration-200 ${
                  isRecording || isListening
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={startVoiceRecording}
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
              <Input
                placeholder={
                  isRecording || isListening
                    ? "🎤 Escuchando..."
                    : "Escribe tu mensaje..."
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && sendMessage(inputMessage)
                }
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
