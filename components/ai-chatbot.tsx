"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const predefinedQuestions = [
  "¿Qué documentos necesito para un testamento?",
  "¿Cuánto cuesta una compraventa?",
  "¿Cómo agendar una cita?",
  "¿Qué tipos de poderes existen?",
  "¿Cuánto tiempo toma una escrituración?",
]

const botResponses: Record<string, string> = {
  testamento:
    "Para elaborar un testamento necesitas: identificación oficial vigente, CURP, comprobante de domicilio, y en caso de bienes inmuebles, las escrituras correspondientes. El costo varía según el valor de los bienes. ¿Te gustaría agendar una consulta gratuita?",
  compraventa:
    "El costo de una compraventa depende del valor del inmueble. Incluye honorarios notariales, impuestos y gastos de registro. Puedes usar nuestro simulador de aranceles para obtener una cotización aproximada. ¿Necesitas más información específica?",
  cita: "Puedes agendar tu cita de tres formas: 1) A través de nuestro sistema en línea, 2) Llamando al (664) 123-4567, o 3) Visitando nuestras oficinas. ¿Prefieres que te ayude a agendar ahora?",
  poderes:
    "Existen varios tipos de poderes: General (facultades amplias), Especial (actos específicos), y para Pleitos y Cobranzas (representación legal). Cada uno tiene diferentes alcances y costos. ¿Para qué necesitas el poder?",
  tiempo:
    "Los tiempos varían según el trámite: Testamentos (1-2 días), Poderes (1-2 días), Compraventas (15-30 días hábiles). Trabajamos para agilizar todos los procesos manteniendo la seguridad jurídica.",
  default:
    "Gracias por tu pregunta. Para brindarte la mejor respuesta, te recomiendo contactar directamente a nuestro equipo de expertos. Puedes agendar una consulta gratuita o llamarnos al (664) 123-4567. ¿Hay algo más en lo que pueda ayudarte?",
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy el asistente virtual de Notaría Pública No. 3. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== "default" && message.includes(key)) {
        return response
      }
    }

    return botResponses.default
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateBotResponse(text),
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleQuickQuestion = (question: string) => {
    sendMessage(question)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 z-50 w-80 shadow-xl border-border transition-all ${
        isMinimized ? "h-16" : "h-96"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Asistente Virtual
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-2 text-sm ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "bot" && <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    <span>{message.text}</span>
                    {message.sender === "user" && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                  </div>
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
            <div className="p-3 border-t border-border">
              <div className="text-xs text-muted-foreground mb-2">Preguntas frecuentes:</div>
              <div className="flex flex-wrap gap-1">
                {predefinedQuestions.slice(0, 3).map((question, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question.length > 25 ? question.substring(0, 25) + "..." : question}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Escribe tu pregunta..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
                className="text-sm"
              />
              <Button
                size="icon"
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
