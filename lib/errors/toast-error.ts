import { appToast } from "@/components/ui/toaster";

export function appToastError(error: any) {
  appToast.success({
    title: "Error",
    description: error.message,
    closeButton: true,
  });
}
