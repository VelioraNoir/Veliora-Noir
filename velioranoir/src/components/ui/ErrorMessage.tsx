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
    <div className="glass-card p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 text-metallic-silver-400">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="font-playfair text-heading text-metallic-charcoal-800 dark:text-metallic-platinum-200 mb-2">
        {title}
      </h3>
      <p className="text-metallic-charcoal-600 dark:text-metallic-platinum-400 mb-6">
        {message}
      </p>
      {retry && (
        <button onClick={retry} className="btn-metallic-primary">
          Try Again
        </button>
      )}
    </div>
  );
};