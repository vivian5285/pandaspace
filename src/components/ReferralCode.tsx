import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ReferralCodeProps {
  code: string;
  link: string;
}

export const ReferralCode: React.FC<ReferralCodeProps> = ({ code, link }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    await navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">邀请信息</h2>
      
      <div className="space-y-4">
        {/* 邀请码 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm text-gray-500">我的邀请码</label>
            <span className="text-lg font-medium">{code}</span>
          </div>
          <button
            onClick={() => copyToClipboard(code, 'code')}
            className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
          >
            {copiedCode ? (
              <CheckIcon className="h-5 w-5 mr-1" />
            ) : (
              <ClipboardIcon className="h-5 w-5 mr-1" />
            )}
            {copiedCode ? '已复制' : '复制'}
          </button>
        </div>

        {/* 邀请链接 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 mr-4">
            <label className="block text-sm text-gray-500">邀请链接</label>
            <span className="text-sm font-medium truncate block">{link}</span>
          </div>
          <button
            onClick={() => copyToClipboard(link, 'link')}
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
          >
            {copiedLink ? (
              <CheckIcon className="h-5 w-5 mr-1" />
            ) : (
              <ClipboardIcon className="h-5 w-5 mr-1" />
            )}
            {copiedLink ? '已复制' : '复制链接'}
          </button>
        </div>
      </div>
    </div>
  );
}; 