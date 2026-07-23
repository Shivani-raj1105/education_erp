import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'danger', loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pt-1">{message}</p>
      </div>
    </Modal>
  );
}
