import { toast, type ToastOptions, type TypeOptions } from "react-toastify";

interface CustomToastProps {
  message: string;
  type?: TypeOptions;
  options?: ToastOptions;
}

export const customToast = ({
  message,
  type = "default",
  options = {},
}: CustomToastProps) => {
  toast(message, {
    type,
    autoClose: 2000,
    pauseOnFocusLoss: false,
    position: "bottom-right",
    theme: "dark",
    ...options,
  });
};
