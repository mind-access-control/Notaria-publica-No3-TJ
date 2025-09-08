import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    // Validar el nombre del archivo para seguridad
    const allowedFiles = ["testamento.pdf", "compraventa.pdf", "poder.pdf"];
    if (!allowedFiles.includes(filename)) {
      return NextResponse.json(
        { error: "Archivo no encontrado" },
        { status: 404 }
      );
    }

    // Ruta al archivo en la carpeta public
    const filePath = path.join(process.cwd(), "public", "formatos", filename);

    // Verificar si el archivo existe
    try {
      await fs.access(filePath);
    } catch {
      // Si no existe, crear un archivo PDF de ejemplo
      return NextResponse.json({
        message: "Archivo no disponible temporalmente",
        downloadUrl: `/formatos/${filename}`,
      });
    }

    // Leer el archivo
    const fileBuffer = await fs.readFile(filePath);

    // Configurar headers para descarga
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Content-Length", fileBuffer.length.toString());

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error al descargar archivo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
