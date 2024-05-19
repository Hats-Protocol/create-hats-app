import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({
  children,
  title,
  isOpen,
  onClose,
}: ModalProps) {
  return (
    <Dialog defaultOpen open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
