import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: 'tutorial' | 'guide' | 'news';
  uploadDate: string;
  duration: string;
}

interface UploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  message: string;
}

interface NewVideo {
  title: string;
  description: string;
  category: 'tutorial' | 'guide' | 'news';
  file: File | null;
}

const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [newVideo, setNewVideo] = useState<NewVideo>({
    title: '',
    description: '',
    category: 'tutorial',
    file: null,
  });

  // 过滤和排序视频列表
  const filteredVideos = videos
    .filter((video: Video) => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a: Video, b: Video) => {
      if (sortBy === 'date') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewVideo({ ...newVideo, file });
    }
  };

  // 模拟上传进度
  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress({
        progress,
        status: 'uploading',
        message: `上传进度: ${progress}%`,
      });

      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress({
          progress: 100,
          status: 'completed',
          message: '上传完成！',
        });
        setTimeout(() => {
          setUploadProgress(null);
        }, 2000);
      }
    }, 500);
  };

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.file) return;

    setUploadProgress({
      progress: 0,
      status: 'uploading',
      message: '开始上传...',
    });

    simulateUploadProgress();

    try {
      const formData = new FormData();
      formData.append('file', newVideo.file);
      formData.append('title', newVideo.title);
      formData.append('description', newVideo.description);
      formData.append('category', newVideo.category);

      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setVideos([...videos, data]);
      setIsUploadModalOpen(false);
      setNewVideo({ title: '', description: '', category: 'tutorial', file: null });
    } catch (error) {
      setUploadProgress({
        progress: 0,
        status: 'error',
        message: '上传失败，请重试',
      });
      console.error('上传视频失败:', error);
    }
  };

  const handleEditVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideo) return;

    try {
      const response = await fetch(`/api/admin/videos/${selectedVideo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedVideo),
      });

      const updatedVideo = await response.json();
      setVideos(videos.map((video: Video) => 
        video.id === updatedVideo.id ? updatedVideo : video
      ));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('更新视频失败:', error);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE',
      });
      setVideos(videos.filter((video: Video) => video.id !== videoId));
    } catch (error) {
      console.error('删除视频失败:', error);
    }
  };

  // 处理输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    setter: (value: any) => void
  ) => {
    setter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            视频管理
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            管理教学视频和平台指南
          </p>
        </motion.div>

        {/* 搜索和筛选 */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="搜索视频..."
            value={searchTerm}
            onChange={(e) => handleInputChange(e, setSearchTerm)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
          />
          <select
            value={selectedCategory}
            onChange={(e) => handleInputChange(e, setSelectedCategory)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
          >
            <option value="all">所有分类</option>
            <option value="tutorial">教程</option>
            <option value="guide">指南</option>
            <option value="news">新闻</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => handleInputChange(e, setSortBy)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
          >
            <option value="date">按日期排序</option>
            <option value="title">按标题排序</option>
          </select>
        </div>

        {/* 视频列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video: Video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4">
                  <button
                    onClick={() => {
                      setSelectedVideo(video);
                      setIsPreviewModalOpen(true);
                    }}
                    className="text-white hover:text-panda-accent"
                  >
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVideo(video);
                      setIsEditModalOpen(true);
                    }}
                    className="text-white hover:text-panda-accent"
                  >
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {video.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 上传按钮 */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsUploadModalOpen(true)}
          className="fixed bottom-8 right-8 bg-panda-accent text-white p-4 rounded-full shadow-lg hover:bg-opacity-90"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </motion.button>

        {/* 上传进度 */}
        {uploadProgress && (
          <div className="fixed bottom-8 left-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="w-64">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-panda-accent rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {uploadProgress.message}
              </p>
            </div>
          </div>
        )}

        {/* 预览模态框 */}
        {isPreviewModalOpen && selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedVideo.title}
                </h3>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="aspect-video">
                <ReactPlayer
                  url={selectedVideo.url}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            </div>
          </div>
        )}

        {/* 编辑模态框 */}
        {isEditModalOpen && selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                编辑视频
              </h3>
              <form onSubmit={handleEditVideo}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    标题
                  </label>
                  <input
                    type="text"
                    value={selectedVideo.title}
                    onChange={(e) =>
                      setSelectedVideo({ ...selectedVideo, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    描述
                  </label>
                  <textarea
                    value={selectedVideo.description}
                    onChange={(e) =>
                      setSelectedVideo({ ...selectedVideo, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    分类
                  </label>
                  <select
                    value={selectedVideo.category}
                    onChange={(e) =>
                      setSelectedVideo({
                        ...selectedVideo,
                        category: e.target.value as 'tutorial' | 'guide' | 'news',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                  >
                    <option value="tutorial">教程</option>
                    <option value="guide">指南</option>
                    <option value="news">新闻</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 上传模态框 */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                上传新视频
              </h3>
              <form onSubmit={handleUploadVideo}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    标题
                  </label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    描述
                  </label>
                  <textarea
                    value={newVideo.description}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    分类
                  </label>
                  <select
                    value={newVideo.category}
                    onChange={(e) =>
                      setNewVideo({
                        ...newVideo,
                        category: e.target.value as 'tutorial' | 'guide' | 'news',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                  >
                    <option value="tutorial">教程</option>
                    <option value="guide">指南</option>
                    <option value="news">新闻</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    视频文件
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90"
                  >
                    上传
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoManagement; 