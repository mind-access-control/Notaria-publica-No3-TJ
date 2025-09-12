import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = join(process.cwd(), "documentos_legales", filename);

    const fileBuffer = await readFile(filePath);

    // Determinar el tipo de contenido basado en la extensión
    const extension = filename.split(".").pop()?.toLowerCase();
    let contentType = "application/octet-stream";

    switch (extension) {
      case "pdf":
        contentType = "application/pdf";
        break;
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "doc":
        contentType = "application/msword";
        break;
      case "docx":
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error serving document:", error);
    return new NextResponse("Document not found", { status: 404 });
  }
}
