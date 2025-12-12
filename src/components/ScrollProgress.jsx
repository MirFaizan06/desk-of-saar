import { memo } from 'react';
import { motion } from 'framer-motion';

function ScrollProgress({ progress }) {
  return (
    <motion.div
      className="scroll-progress"
      style={{ width: `${progress}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
}

export default memo(ScrollProgress);