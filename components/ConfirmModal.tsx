type ConfirmModalProps = {
    message: string,
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({message, onConfirm, onCancel}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <p className="text-gray-800 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Annulla
                    </button>
                    <button
                    onClick={onConfirm}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                    Elimina 
                    </button>
                </div>
            </div>
        </div>
    )
}