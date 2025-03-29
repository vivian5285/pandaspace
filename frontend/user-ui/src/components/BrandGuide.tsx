import React from 'react';

const BrandGuide: React.FC = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">品牌指南</h2>
      
      {/* 颜色展示 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">品牌色彩</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-panda-primary text-white p-4 rounded-lg">
            <p className="font-bold">主色</p>
            <p className="text-sm">#000000</p>
          </div>
          <div className="bg-panda-accent text-white p-4 rounded-lg">
            <p className="font-bold">强调色</p>
            <p className="text-sm">#2ECC71</p>
          </div>
          <div className="bg-panda-gold text-white p-4 rounded-lg">
            <p className="font-bold">辅助色</p>
            <p className="text-sm">#F1C40F</p>
          </div>
          <div className="bg-panda-background border border-gray-200 p-4 rounded-lg">
            <p className="font-bold">背景色</p>
            <p className="text-sm">#F9F9F9</p>
          </div>
        </div>
      </div>

      {/* 字体展示 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">字体系统</h3>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-display">Poppins - 标题字体</p>
            <p className="text-sm text-gray-600">用于标题和重要文字</p>
          </div>
          <div>
            <p className="text-xl font-sans">思源黑体 - 正文字体</p>
            <p className="text-sm text-gray-600">用于正文和一般文字</p>
          </div>
        </div>
      </div>

      {/* 按钮样式 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">按钮样式</h3>
        <div className="space-x-4">
          <button className="bg-panda-accent text-white px-6 py-2 rounded-lg hover:bg-opacity-90">
            主要按钮
          </button>
          <button className="bg-white text-panda-accent border border-panda-accent px-6 py-2 rounded-lg hover:bg-panda-accent hover:text-white">
            次要按钮
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandGuide; 