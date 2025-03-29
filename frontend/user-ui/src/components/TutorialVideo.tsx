import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';

interface TutorialVideoProps {
  url: string;
  title: string;
  description: string;
}

const TutorialVideo: React.FC<TutorialVideoProps> = ({ url, title, description }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <div className="relative aspect-video">
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          playing={isPlaying}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </motion.div>
  );
};

export default TutorialVideo; 