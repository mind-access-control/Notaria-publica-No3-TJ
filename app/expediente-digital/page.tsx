"use client";

import { useSearchParams } from "next/navigation";
import { ExpedienteDigital } from "@/components/expediente-digital";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ExpedienteDigitalPage() {
  const searchParams = useSearchParams();
  const tramiteId = searchParams.get("tramite") || "testamento";
  const usuario = searchParams.get("usuario") || "Usuario";
  const expedienteId = searchParams.get("expediente");
  const datosCodificados = searchParams.get("datos");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <ExpedienteDigital
          tramiteId={tramiteId}
          usuario={usuario}
          expedienteId={expedienteId}
          datosCodificados={datosCodificados}
        />
      </div>
      <Footer />
    </div>
  );
}
