"use client";

import React, { useState, useRef, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Type, X, GripVertical, Edit3 } from 'lucide-react';
import { VariablePlantilla } from '@/lib/variables-predefinidas';

interface BlockEditorProps {
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

interface VariableBlockProps {
  variable: VariablePlantilla;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

interface TextBlockProps {
  block: ContentBlock;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const VariableBlock = ({ variable, onDelete, isDragging = false }: VariableBlockProps) => {
  if (!variable) return null;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: `var_${variable.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`inline-block ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="inline-flex items-center space-x-1 bg-blue-100 border border-blue-300 rounded-md px-2 py-1 mx-1 my-1 group hover:bg-blue-200 transition-colors">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-3 w-3 text-blue-600" />
        </div>
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
    </div>
  );
};

const TextBlock = ({ block, onUpdate, onDelete, isDragging = false }: TextBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: block.id });

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdate(block.id, editContent);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditContent(block.content);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? 'shadow-lg' : ''}`}
    >
      {isEditing ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[40px]"
            placeholder="Escribe tu texto aquí..."
          />
          <div className="absolute top-1 right-1 flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSave}
              className="h-6 w-6 p-0"
            >
              ✓
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditContent(block.content);
                setIsEditing(false);
              }}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="flex items-start space-x-2">
            <div {...attributes} {...listeners} className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div 
              className="flex-1 p-2 border border-transparent hover:border-gray-300 rounded-md cursor-text min-h-[40px] whitespace-pre-wrap"
              onClick={() => setIsEditing(true)}
            >
              {block.content || (
                <span className="text-gray-400 italic">Haz clic para escribir texto...</span>
              )}
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(block.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BlockEditor: React.FC<BlockEditorProps> = ({
  variables,
  onVariablesChange,
  contenido,
  onContenidoChange,
  variablesDisponibles,
  onAgregarVariable
}) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Inicializar bloques desde el contenido
  useEffect(() => {
    if (contenido) {
      const newBlocks = parseContentToBlocks(contenido);
      setBlocks(newBlocks);
    } else {
      // Si no hay contenido, crear un bloque de texto vacío
      setBlocks([{
        id: 'text_0',
        type: 'text',
        content: '',
        position: 0
      }]);
    }
  }, []);

  // Actualizar contenido cuando cambien los bloques
  useEffect(() => {
    const newContent = blocks.map(block => {
      if (block.type === 'variable') {
        return `{{${block.content}}}`;
      }
      return block.content;
    }).join('');
    
    if (newContent !== contenido) {
      onContenidoChange(newContent);
    }
  }, [blocks]);

  const parseContentToBlocks = (content: string): ContentBlock[] => {
    const blocks: ContentBlock[] = [];
    let position = 0;
    
    const variableRegex = /\{\{([^}]+)\}\}/g;
    let lastIndex = 0;
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      // Agregar texto antes de la variable
      if (match.index > lastIndex) {
        const textContent = content.substring(lastIndex, match.index);
        if (textContent.trim() || blocks.length === 0) {
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
          content: variableName,
          variableId: variable.id,
          position: blocks.length
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Agregar texto restante
    if (lastIndex < content.length) {
      const textContent = content.substring(lastIndex);
      if (textContent.trim() || blocks.length === 0) {
        blocks.push({
          id: `text_${position++}`,
          type: 'text',
          content: textContent,
          position: blocks.length
        });
      }
    }

    // Si no hay bloques, crear uno de texto vacío
    if (blocks.length === 0) {
      blocks.push({
        id: 'text_0',
        type: 'text',
        content: '',
        position: 0
      });
    }

    return blocks;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        setBlocks(newBlocks);
      }
    }
    
    setActiveId(null);
  };

  const handleAddVariable = (variable: any) => {
    onAgregarVariable(variable.id);
    
    // Agregar variable como bloque
    const newBlock: ContentBlock = {
      id: `var_${variable.id}`,
      type: 'variable',
      content: variable.nombre,
      variableId: variable.id,
      position: blocks.length
    };
    
    setBlocks(prev => [...prev, newBlock]);
  };

  const handleUpdateBlock = (blockId: string, newContent: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, content: newContent } : block
    ));
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  const handleAddTextBlock = () => {
    const newBlock: ContentBlock = {
      id: `text_${Date.now()}`,
      type: 'text',
      content: '',
      position: blocks.length
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  return (
    <div className="space-y-4">
      {/* Variables agregadas */}
      <div>
        <h4 className="text-md font-medium mb-3">Variables en la Plantilla</h4>
        {variables.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {variables.map((variable) => (
              <div key={variable.id} className="inline-flex items-center space-x-1 bg-blue-100 border border-blue-300 rounded-md px-2 py-1">
                <Type className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">
                  {variable.nombre}
                </span>
                <Badge variant="secondary" className="text-xs bg-blue-200 text-blue-800">
                  {variable.tipo}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No hay variables agregadas</p>
          </div>
        )}
      </div>

      {/* Editor de bloques */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-medium">Contenido de la Plantilla</h4>
          <Button size="sm" variant="outline" onClick={handleAddTextBlock}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Texto
          </Button>
        </div>
        
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 min-h-[200px] p-4 border border-gray-300 rounded-lg">
              {blocks.map((block) => (
                <div key={block.id}>
                  {block.type === 'text' ? (
                    <TextBlock
                      block={block}
                      onUpdate={handleUpdateBlock}
                      onDelete={handleDeleteBlock}
                      isDragging={activeId === block.id}
                    />
                  ) : (
                    (() => {
                      const variable = variables.find(v => v.id === block.variableId);
                      return variable ? (
                        <VariableBlock
                          variable={variable}
                          onDelete={(variableId) => {
                            handleDeleteBlock(block.id);
                            onVariablesChange(variables.filter(v => v.id !== variableId));
                          }}
                          isDragging={activeId === block.id}
                        />
                      ) : null;
                    })()
                  )}
                </div>
              ))}
              {blocks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay bloques de contenido</p>
                  <p className="text-sm">Agrega texto o variables para comenzar</p>
                </div>
              )}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <div>
                {blocks.find(b => b.id === activeId)?.type === 'text' ? (
                  <TextBlock
                    block={blocks.find(b => b.id === activeId)!}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                    isDragging={true}
                  />
                ) : (
                  (() => {
                    const variable = variables.find(v => v.id === activeId.replace('var_', ''));
                    return variable ? (
                      <VariableBlock
                        variable={variable}
                        onDelete={() => {}}
                        isDragging={true}
                      />
                    ) : null;
                  })()
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Variables disponibles */}
      <div>
        <h4 className="text-md font-medium mb-3">Variables Disponibles</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
          {variablesDisponibles.map((variable) => (
            <Card 
              key={variable.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleAddVariable(variable)}
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

export default BlockEditor;
