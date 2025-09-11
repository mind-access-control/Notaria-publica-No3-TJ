"use client";

import React, { useState, useRef, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import { VariablePlantilla } from '@/lib/variables-predefinidas';

interface DragDropEditorProps {
  variables: VariablePlantilla[];
  onVariablesChange: (variables: VariablePlantilla[]) => void;
  contenido: string;
  onContenidoChange: (contenido: string) => void;
  variablesDisponibles: any[];
  onAgregarVariable: (variableId: string) => void;
}

interface VariableItemProps {
  variable: VariablePlantilla;
  onEliminar: (id: string) => void;
  isDragging?: boolean;
}

const VariableItem = ({ variable, onEliminar, isDragging = false }: VariableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: variable.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-lg' : ''}`}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">{variable.nombre}</span>
                <Badge variant="outline" className="text-xs">
                  {variable.tipo}
                </Badge>
                {variable.obligatoria && (
                  <Badge variant="destructive" className="text-xs">
                    Obligatoria
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {variable.descripcion}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEliminar(variable.id)}
            className="text-red-600 hover:text-red-700 ml-2"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const DragDropEditor: React.FC<DragDropEditorProps> = ({
  variables,
  onVariablesChange,
  contenido,
  onContenidoChange,
  variablesDisponibles,
  onAgregarVariable
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = variables.findIndex(item => item.id === active.id);
      const newIndex = variables.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newVariables = arrayMove(variables, oldIndex, newIndex);
        onVariablesChange(newVariables);
      }
    }
    
    setActiveId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const insertVariableAtCursor = (variable: VariablePlantilla) => {
    if (editorRef.current) {
      const textarea = editorRef.current;
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

  const handleVariableClick = (variable: VariablePlantilla) => {
    insertVariableAtCursor(variable);
  };

  const handleDropOnEditor = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
    
    const variableId = event.dataTransfer.getData('text/plain');
    const variable = variables.find(v => v.id === variableId);
    
    if (variable) {
      insertVariableAtCursor(variable);
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
      {/* Variables agregadas con drag & drop */}
      <div>
        <h4 className="text-md font-medium mb-3">Variables en la Plantilla</h4>
        {variables.length > 0 ? (
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <SortableContext items={variables.map(v => v.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {variables.map((variable) => (
                  <VariableItem
                    key={variable.id}
                    variable={variable}
                    onEliminar={(id) => onVariablesChange(variables.filter(v => v.id !== id))}
                    isDragging={activeId === variable.id}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <VariableItem
                  variable={variables.find(v => v.id === activeId)!}
                  onEliminar={() => {}}
                  isDragging={true}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay variables agregadas</p>
            <p className="text-sm">Arrastra variables desde la lista de disponibles</p>
          </div>
        )}
      </div>

      {/* Editor de contenido con área de drop */}
      <div>
        <h4 className="text-md font-medium mb-3">Contenido de la Plantilla</h4>
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
            isDraggingOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDropOnEditor}
          onDragOver={handleDragOverEditor}
          onDragLeave={handleDragLeaveEditor}
        >
          <textarea
            ref={editorRef}
            value={contenido}
            onChange={(e) => onContenidoChange(e.target.value)}
            placeholder="Escribe el contenido de la plantilla... Puedes arrastrar variables aquí o hacer clic en ellas para insertarlas."
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
              onClick={() => onAgregarVariable(variable.id)}
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

export default DragDropEditor;
