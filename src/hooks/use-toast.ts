
// This ensures our existing toast hook is properly exported
import { type ToastActionElement, type ToastProps } from "@/components/ui/toast"

type ToastType = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const TOAST_LIMIT = 100
const TOAST_REMOVE_DELAY = 1000000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toasts: ToastType[] = []

type Toast = Omit<ToastType, "id">

const useToast = () => {
  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => {
      const toast = toasts.find((toast) => toast.id === toastId)
      if (toast) {
        // Trigger exit animation
        toast.open = false

        // Remove toast from DOM after animation
        setTimeout(() => {
          const index = toasts.findIndex((t) => t.id === toastId)
          if (index !== -1) {
            toasts.splice(index, 1)
          }
        }, TOAST_REMOVE_DELAY)
      }
    },
  }
}

function toast(props: Toast) {
  const id = genId()

  const newToast = {
    ...props,
    id,
    open: true,
  }

  toasts.push(newToast)

  return newToast
}

export { useToast, toast }
