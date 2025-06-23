// components/ImageModal.tsx
import { motion } from 'framer-motion';

export default function ImageModal({
  src,
  index,
  total,
  onClose,
  onNext,
  onPrev,
}: {
  src: string;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative max-w-6xl w-full p-4"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-pink-400"
        >
          &times;
        </button>
        <div className="flex justify-between items-center mb-4 text-white font-medium text-lg">
          <button onClick={onPrev} className="text-2xl px-4">←</button>
          <span className="flex-grow text-center">
            Image {index + 1} of {total}
          </span>
          <button onClick={onNext} className="text-2xl px-4">→</button>
        </div>
        <img
          src={src}
          alt="Preview"
          className="w-full h-auto rounded shadow-lg"
        />
      </motion.div>
    </motion.div>
  );
}
