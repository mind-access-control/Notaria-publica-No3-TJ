"use client";

import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/mobile-nav";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <div className="text-lg font-bold text-foreground">
              Notaría Pública No. 3
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md ${
                isActive("/")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-primary hover:bg-primary/10"
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/servicios"
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md ${
                isActive("/servicios")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-primary hover:bg-primary/10"
              }`}
            >
              Servicios
            </Link>
            <Link
              href="/nosotros"
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md ${
                isActive("/nosotros")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-primary hover:bg-primary/10"
              }`}
            >
              Nosotros
            </Link>
            <Link
              href="/blog"
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md ${
                isActive("/blog")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-primary hover:bg-primary/10"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/contacto"
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md ${
                isActive("/contacto")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-primary hover:bg-primary/10"
              }`}
            >
              Contacto
            </Link>
            <Link href="/citas" className="cursor-pointer">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 cursor-pointer"
              >
                Agendar Cita
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <MobileNav currentPath={pathname} />
          </div>
        </div>
      </div>
    </nav>
  );
}
