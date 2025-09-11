"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Type, Search, X } from 'lucide-react';
import { VariablePlantilla } from '@/lib/variables-predefinidas';

interface SimpleVariableEditorProps {
  variables: VariablePlantilla[];
  onVariablesChange: (variables: VariablePlantilla[]) => void;
  contenido: string;
  onContenidoChange: (contenido: string) => void;
  variablesDisponibles: any[];
  onAgregarVariable: (variableId: string) => void;
}

const SimpleVariableEditor: React.FC<SimpleVariableEditorProps> = ({
  variables,
  onVariablesChange,
  contenido,
  onContenidoChange,
  variablesDisponibles,
  onAgregarVariable
}) => {
  const [showVariableMenu, setShowVariableMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Función para extraer variables del contenido
  const extractVariablesFromContent = (content: string) => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const foundVariables = new Set<string>();
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      foundVariables.add(match[1]);
    }

    return Array.from(foundVariables);
  };

  // Sincronizar variables con el contenido
  React.useEffect(() => {
    const variablesInContent = extractVariablesFromContent(contenido);
    const currentVariableNames = variables.map(v => v.nombre);
    
    // Encontrar variables que ya no están en el contenido
    const variablesToRemove = variables.filter(v => !variablesInContent.includes(v.nombre));
    
    // Encontrar variables nuevas que están en el contenido pero no en la lista
    const newVariables = variablesInContent.filter(varName => !currentVariableNames.includes(varName));
    
    if (variablesToRemove.length > 0 || newVariables.length > 0) {
      // Mantener variables existentes que están en el contenido
      const existingVariables = variables.filter(v => variablesInContent.includes(v.nombre));
      
      // Agregar variables nuevas
      const newVariableObjects = newVariables.map(varName => {
        const variableDef = variablesDisponibles.find(v => v.nombre === varName);
        if (variableDef) {
          return {
            id: `var_${Date.now()}_${Math.random()}`,
            nombre: variableDef.nombre,
            tipo: variableDef.tipo,
            descripcion: variableDef.descripcion,
            obligatoria: variableDef.obligatoria,
            valorPorDefecto: variableDef.valorPorDefecto,
            validaciones: variableDef.validaciones,
            posicion: { inicio: 0, fin: 0 }
          };
        }
        return null;
      }).filter(Boolean);
      
      const updatedVariables = [...existingVariables, ...newVariableObjects];
      onVariablesChange(updatedVariables);
    }
  }, [contenido, variables, onVariablesChange, variablesDisponibles]);

  // Obtener solo las variables que están en el contenido
  const getVariablesInContent = () => {
    const variablesInContent = extractVariablesFromContent(contenido);
    return variables.filter(v => variablesInContent.includes(v.nombre));
  };

  // Filtrar variables disponibles según el término de búsqueda
  const getFilteredVariables = () => {
    if (!searchTerm.trim()) {
      return variablesDisponibles;
    }
    
    return variablesDisponibles.filter(variable => 
      variable.etiqueta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Cerrar menú y limpiar búsqueda
  const closeMenu = () => {
    setShowVariableMenu(false);
    setSearchTerm('');
  };

  const insertVariableAtCursor = (variable: any) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
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
    
    // Cerrar el menú
    setShowVariableMenu(false);
  };

  const handleAddVariable = (variable: any) => {
    // Solo insertar en el contenido
    insertVariableAtCursor(variable);
    
    // Cerrar el menú y limpiar búsqueda
    closeMenu();
    
    // La sincronización automática se encargará de agregar la variable a la lista
  };

  return (
    <div className="space-y-4">
      {/* Editor de contenido */}
      <div>
        <h4 className="text-md font-medium mb-3">Contenido de la Plantilla</h4>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={contenido}
            onChange={(e) => onContenidoChange(e.target.value)}
            placeholder="Escribe el contenido de la plantilla..."
            className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Botón para agregar variables */}
          <div className="absolute bottom-3 right-3">
            <Button
              type="button"
              size="sm"
              onClick={() => setShowVariableMenu(!showVariableMenu)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Variable
            </Button>
          </div>
        </div>
      </div>

      {/* Menú compacto de variables disponibles */}
      {showVariableMenu && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-lg">
          {/* Header del menú */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h4 className="text-md font-medium">Agregar Variable</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMenu}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Campo de búsqueda */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar variable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
          
          {/* Lista de variables */}
          <div className="max-h-60 overflow-y-auto">
            {getFilteredVariables().length > 0 ? (
              <div className="p-2">
                {getFilteredVariables().map((variable) => (
                  <div
                    key={variable.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    onClick={() => handleAddVariable(variable)}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <Type className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{variable.etiqueta}</span>
                          <Badge variant="outline" className="text-xs">
                            {variable.tipo}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {variable.descripcion}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No se encontraron variables</p>
                <p className="text-xs">Intenta con otro término de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Variables en el contenido (solo para referencia) */}
      {getVariablesInContent().length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3">Variables en el Contenido</h4>
          <div className="flex flex-wrap gap-2">
            {getVariablesInContent().map((variable) => (
              <div key={variable.id} className="inline-flex items-center space-x-1 bg-blue-100 border border-blue-300 rounded-md px-2 py-1">
                <Type className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">
                  {variable.nombre}
                </span>
                <Badge variant="outline" className="text-xs border-blue-400 text-blue-700 bg-blue-50">
                  {variable.tipo}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleVariableEditor;
