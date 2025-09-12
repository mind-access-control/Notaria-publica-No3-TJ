import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    
    // En un sistema real, aquí buscarías el documento en la base de datos
    // y retornarías el archivo real. Por ahora usamos archivos de ejemplo.
    
    let documentPath: string;
    let contentType: string;
    let filename: string;
    
    switch (documentId) {
      case '1':
        // PDF de identificación
        documentPath = join(process.cwd(), 'public', 'sample-documents', 'identificacion.pdf');
        contentType = 'application/pdf';
        filename = 'identificacion_oficial.pdf';
        break;
      case '2':
        // PDF de comprobante de domicilio
        documentPath = join(process.cwd(), 'public', 'sample-documents', 'identificacion.pdf');
        contentType = 'application/pdf';
        filename = 'comprobante_domicilio.pdf';
        break;
      case '3':
        // PDF de acta de nacimiento
        documentPath = join(process.cwd(), 'public', 'sample-documents', 'identificacion.pdf');
        contentType = 'application/pdf';
        filename = 'acta_nacimiento.pdf';
        break;
      case '4':
        // PDF de estado civil
        documentPath = join(process.cwd(), 'public', 'sample-documents', 'identificacion.pdf');
        contentType = 'application/pdf';
        filename = 'estado_civil.pdf';
        break;
      case '5':
        // PDF de bienes y propiedades
        documentPath = join(process.cwd(), 'public', 'sample-documents', 'identificacion.pdf');
        contentType = 'application/pdf';
        filename = 'bienes_propiedades.pdf';
        break;
      default:
        return NextResponse.json(
          { error: 'Documento no encontrado' },
          { status: 404 }
        );
    }
    
    try {
      // Leer el archivo PDF real
      const documentData = await readFile(documentPath);
      
      return new NextResponse(documentData, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (fileError) {
      console.error('Error reading file:', fileError);
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('Error serving document:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
