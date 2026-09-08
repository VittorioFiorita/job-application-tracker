type ToastProps = {
    message: string;
    onClose: () => void;
};

export default function Toast({message, onClose}: ToastProps) {
    return (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 z-50">
            <span className="text-sm">{message}</span>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">
                ✕
            </button>
        </div>
    )
}