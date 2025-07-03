// src/components/3d/Placeholder3D.tsx
interface Placeholder3DProps {
  className?: string;
}

export default function Placeholder3D({ className = '' }: Placeholder3DProps) {
  return (
    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center ${className}`}>
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">3D Viewer</h3>
        <p className="text-sm text-gray-600">Coming Soon</p>
      </div>
    </div>
  );
}