import React, { createContext, useContext, useState, useCallback } from 'react';
import * as Toast from '@radix-ui/react-toast';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast debe ser usado dentro de ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(({ title, description, type = 'info', duration = 5000 }) => {
        const id = Date.now();
        const newToast = { id, title, description, type, duration, open: true };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => removeToast(id), duration);

        return id;
    }, [removeToast]);

    const success = useCallback((title, description) => {
        return showToast({ title, description, type: 'success' });
    }, [showToast]);

    const error = useCallback((title, description) => {
        return showToast({ title, description, type: 'error' });
    }, [showToast]);

    const warning = useCallback((title, description) => {
        return showToast({ title, description, type: 'warning' });
    }, [showToast]);

    const info = useCallback((title, description) => {
        return showToast({ title, description, type: 'info' });
    }, [showToast]);

    const value = {
        showToast,
        success,
        error,
        warning,
        info,
        removeToast,
    };

    const getToastStyles = (type) => {
        const baseStyles = "bg-white border rounded-lg shadow-lg p-4 flex flex-col gap-1";
        const typeStyles = {
            success: "border-green-500",
            error: "border-red-500",
            warning: "border-yellow-500",
            info: "border-blue-500",
        };
        return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
            default:
                return 'ℹ';
        }
    };

    const getIconColorClass = (type) => {
        const colors = {
            success: "text-green-500",
            error: "text-red-500",
            warning: "text-yellow-500",
            info: "text-blue-500",
        };
        return colors[type] || colors.info;
    };

    return (
        <ToastContext.Provider value={value}>
            <Toast.Provider swipeDirection="right" duration={5000}>
                {children}
                {toasts.map((toast) => (
                    <Toast.Root
                        key={toast.id}
                        data-testid={`toast-${toast.type}`}
                        className={getToastStyles(toast.type)}
                        open={toast.open}
                        onOpenChange={(open) => {
                            if (!open) removeToast(toast.id);
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <span className={`text-xl font-bold ${getIconColorClass(toast.type)}`}>
                                {getIconForType(toast.type)}
                            </span>
                            <div className="flex-1">
                                {toast.title && (
                                    <Toast.Title className="font-semibold text-gray-900">
                                        {toast.title}
                                    </Toast.Title>
                                )}
                                {toast.description && (
                                    <Toast.Description className="text-sm text-gray-600 mt-1">
                                        {toast.description}
                                    </Toast.Description>
                                )}
                            </div>
                            <Toast.Close className="text-gray-400 hover:text-gray-600">
                                ✕
                            </Toast.Close>
                        </div>
                    </Toast.Root>
                ))}
                <Toast.Viewport className="fixed top-0 right-0 flex flex-col gap-2 p-6 w-96 max-w-full z-50" />
            </Toast.Provider>
        </ToastContext.Provider>
    );
};
