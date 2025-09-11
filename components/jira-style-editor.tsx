"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Type, X } from 'lucide-react';
import { VariablePlantilla } from '@/lib/variables-predefinidas';

interface JiraStyleEditorProps {
  variables: VariablePlantilla[];
  onVariablesChange: (variables: VariablePlantilla[]) => void;
  contenido: string;
  onContenidoChange: (contenido: string) => void;
  variablesDisponibles: any[];
  onAgregarVariable: (variableId: string) => void;
}

interface ContentBlock {
  id: string;
  type: 'text' | 'variable';
  content: string;
  variableId?: string;
  position: number;
}

interface VariableCardProps {
  variable: VariablePlantilla;
  onDelete: (id: string) => void;
}

const VariableCard = ({ variable, onDelete }: VariableCardProps) => {
  return (
    <div className="inline-flex items-center space-x-1 bg-blue-100 border border-blue-300 rounded-md px-2 py-1 mx-1 my-1 group hover:bg-blue-200 transition-colors">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(variable.id)}
        className="h-4 w-4 p-0 text-gray-400 hover:text-red-600 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </Button>
      <Type className="h-3 w-3 text-blue-600" />
      <span className="text-xs font-medium text-blue-800">
        {variable.nombre}
      </span>
      <Badge variant="secondary" className="text-xs bg-blue-200 text-blue-800">
        {variable.tipo}
      </Badge>
    </div>
  );
};

const JiraStyleEditor: React.FC<JiraStyleEditorProps> = ({
  variables,
  onVariablesChange,
  contenido,
  onContenidoChange,
  variablesDisponibles,
  onAgregarVariable
}) => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Parsear el contenido en bloques de texto y variables
  useEffect(() => {
    const blocks: ContentBlock[] = [];
    let position = 0;
    
    // Dividir el contenido por variables
    const variableRegex = /\{\{([^}]+)\}\}/g;
    let lastIndex = 0;
    let match;

    while ((match = variableRegex.exec(contenido)) !== null) {
      // Agregar texto antes de la variable
      if (match.index > lastIndex) {
        const textContent = contenido.substring(lastIndex, match.index);
        if (textContent.trim()) {
          blocks.push({
            id: `text_${position++}`,
            type: 'text',
            content: textContent,
            position: blocks.length
          });
        }
      }

      // Agregar la variable
      const variableName = match[1];
      const variable = variables.find(v => v.nombre === variableName);
      if (variable) {
        blocks.push({
          id: `var_${variable.id}`,
          type: 'variable',
          content: match[0],
          variableId: variable.id,
          position: blocks.length
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Agregar texto restante
    if (lastIndex < contenido.length) {
      const textContent = contenido.substring(lastIndex);
      if (textContent.trim()) {
        blocks.push({
          id: `text_${position++}`,
          type: 'text',
          content: textContent,
          position: blocks.length
        });
      }
    }

    setContentBlocks(blocks);
  }, [contenido, variables]);

  const handleVariableClick = (variable: VariablePlantilla) => {
    // Insertar al final del contenido
    const variableText = `{{${variable.nombre}}}`;
    const newContent = contenido + (contenido ? '\n' : '') + variableText;
    onContenidoChange(newContent);
  };

  const insertVariableAtCursor = (variable: VariablePlantilla) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const variableText = `{{${variable.nombre}}}`;
      
      const newContent = 
        contenido.substring(0, start) + 
        variableText + 
        contenido.substring(end);
      
      onContenidoChange(newContent);
      
      // Restaurar el cursor después de la variable insertada
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableText.length, start + variableText.length);
      }, 0);
    }
  };

  const handleDeleteVariable = (variableId: string) => {
    const newContent = contenido.replace(new RegExp(`\\{\\{[^}]*\\}\\}`, 'g'), (match) => {
      const variableName = match.replace(/\{\{|\}\}/g, '');
      const variable = variables.find(v => v.nombre === variableName);
      return variable && variable.id === variableId ? '' : match;
    });
    onContenidoChange(newContent);
  };

  const handleDropOnEditor = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
    
    const variableId = event.dataTransfer.getData('text/plain');
    const variable = variablesDisponibles.find(v => v.id === variableId);
    
    if (variable) {
      // Insertar al final del contenido
      const variableText = `{{${variable.nombre}}}`;
      const newContent = contenido + (contenido ? '\n' : '') + variableText;
      onContenidoChange(newContent);
    }
  };

  const handleDragOverEditor = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeaveEditor = () => {
    setIsDraggingOver(false);
  };

  return (
    <div className="space-y-4">
      {/* Variables agregadas */}
      <div>
        <h4 className="text-md font-medium mb-3">Variables en la Plantilla</h4>
        {variables.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {variables.map((variable) => (
              <VariableCard
                key={variable.id}
                variable={variable}
                onDelete={handleDeleteVariable}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay variables agregadas</p>
            <p className="text-sm">Arrastra variables desde la lista de disponibles</p>
          </div>
        )}
      </div>

      {/* Editor híbrido: texto + variables como cards */}
      <div>
        <h4 className="text-md font-medium mb-3">Contenido de la Plantilla</h4>
        <div className="space-y-4">
          {/* Editor de texto normal */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
              isDraggingOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300'
            }`}
            onDrop={handleDropOnEditor}
            onDragOver={handleDragOverEditor}
            onDragLeave={handleDragLeaveEditor}
          >
            <textarea
              value={contenido}
              onChange={(e) => onContenidoChange(e.target.value)}
              placeholder="Escribe el contenido de la plantilla... Usa {{variable}} para las variables."
              className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isDraggingOver && (
              <div className="absolute inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-blue-600 font-medium">
                  Suelta la variable aquí
                </div>
              </div>
            )}
          </div>
          
          {/* Variables en el contenido (solo visualización) */}
          {contentBlocks.some(block => block.type === 'variable') && (
            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-2">Variables en el contenido:</h5>
              <div className="flex flex-wrap gap-2">
                {contentBlocks
                  .filter(block => block.type === 'variable')
                  .map((block) => {
                    const variable = variables.find(v => v.id === block.variableId);
                    return variable ? (
                      <VariableCard
                        key={block.id}
                        variable={variable}
                        onDelete={handleDeleteVariable}
                      />
                    ) : null;
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Variables disponibles para arrastrar */}
      <div>
        <h4 className="text-md font-medium mb-3">Variables Disponibles</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
          {variablesDisponibles.map((variable) => (
            <Card 
              key={variable.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', variable.id);
              }}
              onClick={() => {
                onAgregarVariable(variable.id);
                insertVariableAtCursor(variable);
              }}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{variable.etiqueta}</span>
                      <Badge variant="outline" className="text-xs">
                        {variable.tipo}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {variable.descripcion}
                    </p>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-400">
                        {variable.obligatoria ? "Obligatoria" : "Opcional"}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JiraStyleEditor;
