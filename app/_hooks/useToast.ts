import { toast } from "react-toastify";

type ToastType = 'success' | 'warn' | 'info' | 'error';

/**
 * useToast hook
 * @author Kenneth Sumang
 */
export default function useToast() {
  return (type: ToastType, message: string) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast.info(message);
        break;
      case 'warn':
        toast.warn(message);
        break;
      default:
        return;
    }
  };
}