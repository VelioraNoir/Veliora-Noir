import React from 'react';

interface VariantIndicatorProps {
  variants: Array<{ 
    id: string; 
    title: string; 
    available: boolean;
    options: Array<{ name: string; value: string }>;
  }>;
  className?: string;
}

export const VariantIndicator: React.FC<VariantIndicatorProps> = ({ 
  variants, 
  className = "" 
}) => {
  // Only show if there are multiple variants
  if (variants.length <= 1) return null;

  // Determine what type of variants these are
  const firstVariant = variants[0];
  const optionName = firstVariant?.options?.[0]?.name || 'Size';
  const isSize = optionName.toLowerCase().includes('size');
  const isColor = optionName.toLowerCase().includes('color') || optionName.toLowerCase().includes('colour');
  const isMaterial = optionName.toLowerCase().includes('material') || optionName.toLowerCase().includes('metal');

  // Get unique available options
  const availableOptions = variants
    .filter(v => v.available)
    .map(v => v.options?.[0]?.value || v.title)
    .filter((value, index, self) => self.indexOf(value) === index);

  const displayLabel = isColor ? 'Colors' : isMaterial ? 'Materials' : isSize ? 'Sizes' : 'Options';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 font-medium">{displayLabel}:</span>
        <div className="flex items-center gap-1">
          {availableOptions.slice(0, 3).map((option, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
            >
              {option}
            </span>
          ))}
          {availableOptions.length > 3 && (
            <span className="text-xs text-gray-500 font-medium">
              +{availableOptions.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantIndicator;