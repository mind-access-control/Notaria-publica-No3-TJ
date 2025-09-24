"use client";

import { useState, useEffect } from "react";
import { TramiteSelectionModal } from "./tramite-selection-modal";
import { TramiteAdviceModal } from "./tramite-advice-modal";

interface TramiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTramite?: string;
  onTramiteSelect?: (tramiteId: string) => void;
}

export function TramiteModal({
  isOpen,
  onClose,
  preselectedTramite,
  onTramiteSelect,
}: TramiteModalProps) {
  const [selectedTramite, setSelectedTramite] = useState<string | null>(
    preselectedTramite || null
  );
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);

  // Actualizar cuando cambie el trámite preseleccionado
  useEffect(() => {
    if (preselectedTramite) {
      setSelectedTramite(preselectedTramite);
      setShowAdviceModal(true);
      setShowSelectionModal(false);
    } else {
      setSelectedTramite(null);
      setShowSelectionModal(true);
      setShowAdviceModal(false);
    }
  }, [preselectedTramite]);

  // Mostrar el modal apropiado cuando se abre
  useEffect(() => {
    if (isOpen) {
      if (preselectedTramite) {
        setShowAdviceModal(true);
        setShowSelectionModal(false);
      } else {
        setShowSelectionModal(true);
        setShowAdviceModal(false);
      }
    } else {
      // Cuando se cierra el modal, ocultar ambos sub-modales
      setShowSelectionModal(false);
      setShowAdviceModal(false);
    }
  }, [isOpen, preselectedTramite]);

  const handleTramiteSelect = (tramiteId: string) => {
    setSelectedTramite(tramiteId);
    setShowSelectionModal(false);
    setShowAdviceModal(true);
  };

  const handleCloseSelection = () => {
    setShowSelectionModal(false);
    onClose();
  };

  const handleCloseAdvice = () => {
    setShowAdviceModal(false);
    onClose();
  };

  return (
    <>
      <TramiteSelectionModal
        isOpen={showSelectionModal}
        onClose={handleCloseSelection}
        onTramiteSelect={handleTramiteSelect}
        preselectedTramite={preselectedTramite}
      />
      <TramiteAdviceModal
        isOpen={showAdviceModal}
        onClose={handleCloseAdvice}
        selectedTramiteId={selectedTramite || ""}
        onTramiteSelect={onTramiteSelect}
      />
    </>
  );
}
