// src/components/ui/LoadingComponents.tsx

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded-full w-full"></div>
      </div>
    </div>
  );
};

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export const ErrorMessage = ({ 
  title = "Something went wrong", 
  message, 
  retry 
}: ErrorMessageProps) => {
  return (
    <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-auto shadow-lg">
      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      {retry && (
        <button onClick={retry} className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800">
          Try Again
        </button>
      )}
    </div>
  );
};