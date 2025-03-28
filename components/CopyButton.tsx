import { useState } from 'react';
import { ClipboardCopyIcon, CheckIcon } from '@heroicons/react/outline';

interface CopyButtonProps {
  text: string;
  successDuration?: number;
}

export function CopyButton({ text, successDuration = 2000 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), successDuration);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
        transition-colors duration-200
        ${copied 
          ? 'bg-green-100 text-green-800' 
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        }
      `}
    >
      {copied ? (
        <>
          <CheckIcon className="h-5 w-5 mr-2" />
          已复制
        </>
      ) : (
        <>
          <ClipboardCopyIcon className="h-5 w-5 mr-2" />
          复制邀请码
        </>
      )}
    </button>
  );
} 