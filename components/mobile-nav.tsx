"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Shield,
  Menu,
  X,
  Calculator,
  Calendar,
  FileText,
  Users,
  BookOpen,
  Phone,
} from "lucide-react";
import Link from "next/link";

interface MobileNavProps {
  currentPath?: string;
}

export function MobileNav({ currentPath = "/" }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Inicio", icon: Shield },
    { href: "/servicios", label: "Servicios", icon: FileText },
    { href: "/nosotros", label: "Nosotros", icon: Users },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/contacto", label: "Contacto", icon: Phone },
  ];

  const quickActions = [
    { href: "/simulador", label: "Simulador de Aranceles", icon: Calculator },
    { href: "/citas", label: "Agendar Cita", icon: Calendar },
    { href: "/formatos", label: "Descargar Formatos", icon: FileText },
    { href: "/portal-cliente", label: "Portal del Cliente", icon: Shield },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">
                Notaría Pública No. 3
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Main Navigation */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Navegación
                </h3>
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = currentPath === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Acciones Rápidas
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon;

                    return (
                      <Link
                        key={action.href}
                        href={action.href}
                        onClick={handleLinkClick}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted text-foreground cursor-pointer"
                      >
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span className="font-medium">{action.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Contacto
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-foreground">(664) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-foreground">
                      Tijuana, Baja California
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <Link href="/citas" onClick={handleLinkClick}>
              <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Cita
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
