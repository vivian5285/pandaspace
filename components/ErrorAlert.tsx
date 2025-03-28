interface ErrorAlertProps {
  message: string;
  detail?: string;
}

export function ErrorAlert({ message, detail }: ErrorAlertProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
          {detail && (
            <div className="mt-2 text-sm text-red-700">{detail}</div>
          )}
        </div>
      </div>
    </div>
  );
} 