
import {
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import {
  ToastContext,
  type ToastApi,
  type ToastMessage,
} from "./useToast";

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  // הסרת הודעה מהרשימה
  const removeToast = useCallback((id: string) => {
    setMessages(prev =>
      prev.filter(message => message.id !== id)
    );
  }, []);

  // הוספת הודעה חדשה
  const addToast = useCallback(
    (kind: ToastMessage["kind"], message: string) => {
      const id = crypto.randomUUID();
        setMessages(prev => [...prev, { message, id, kind }]);
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  // אובייקט יציב שמועבר ל-Context
  const value = useMemo<ToastApi>(
  () => ({
    success: (text) => addToast("success", text),
    error: (text) => addToast("error", text),
    info: (text) => addToast("info", text),
  }),
  [addToast]
);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        role="alert"
        aria-live="polite"
        className="toast-container"
      >
        {messages.map(message => (
          <div
            key={message.id}
            className={`toast toast-${message.kind}`}
          >
            <span>{message.message}</span>

            <button
              type="button"
              aria-label="סגירת הודעה"
              onClick={() => removeToast(message.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
