import Button from "./Button"

type ConfirmModalProps = {
    message: string,
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({message, onConfirm, onCancel}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border border-foreground/10 rounded-lg p-6 max-w-sm w-full mx-4">
                <p className="text-foreground mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button onClick={onCancel} variant="ghost">Annulla</Button>
                    <Button onClick={onConfirm} variant="danger">Elimina</Button>
                </div>
            </div>
        </div>
    )
}