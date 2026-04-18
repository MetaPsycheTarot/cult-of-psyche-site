import { useToast } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";

/**
 * Example component showing how to use the notification system
 */
export function NotificationExample() {
  const toast = useToast();

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-bold">Notification Examples</h3>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => toast.success("Success!", "Operation completed successfully")}
          className="bg-green-600 hover:bg-green-700"
        >
          Show Success
        </Button>

        <Button
          onClick={() => toast.error("Error!", "Something went wrong")}
          className="bg-red-600 hover:bg-red-700"
        >
          Show Error
        </Button>

        <Button
          onClick={() => toast.info("Info", "Here's some information")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Show Info
        </Button>

        <Button
          onClick={() => toast.warning("Warning", "Please be careful")}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          Show Warning
        </Button>
      </div>

      <div className="text-sm text-gray-400 mt-4">
        <p>Click any button above to see notifications in action.</p>
        <p>Toast notifications appear in the bottom-right corner.</p>
        <p>Persistent notifications appear in the notification center (bell icon).</p>
      </div>
    </div>
  );
}
