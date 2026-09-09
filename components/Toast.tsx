type ToastProps = {
    message: string;
    onClose: () => void;
};

export default function Toast({message, onClose}: ToastProps) {
    return (
        <div className="fixed bottom-6 right-6 bg-foreground text-background px-4 py-3 rounded shadow-lg flex items-center gap-3 z-50">
            <span className="text-sm">{message}</span>
            <button onClick={onClose} className="text-background/60 hover:text-background text-sm">
                ✕
            </button>
        </div>
    )
}