"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  showCancel?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  showCancel = false,
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
}: NotificationModalProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getIconBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-100";
      case "error":
        return "bg-red-100";
      case "warning":
        return "bg-yellow-100";
      default:
        return "bg-blue-100";
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${getIconBgColor()}`}>
              {getIcon()}
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-gray-600 mt-4">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          {showCancel && (
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            className={
              type === "error"
                ? "bg-red-600 hover:bg-red-700"
                : type === "warning"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
