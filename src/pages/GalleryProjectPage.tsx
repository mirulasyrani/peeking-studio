import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryProjectPage() {
  const { projectFolder } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1); // Track slide direction
  const navigate = useNavigate();

  const fetchImages = useCallback(() => {
    const imageCount = 4;
    const loadedImages: string[] = [];
    for (let i = 1; i <= imageCount; i++) {
      loadedImages.push(`/gallery/${projectFolder}/${i}.png`);
    }
    setImages(loadedImages);
  }, [projectFolder]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const close = () => setSelectedIndex(null);

  const next = () => {
    setDirection(1);
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  };

  const prev = () => {
    setDirection(-1);
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex !== null) {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'Escape') close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (selectedIndex !== null) {
        if (e.deltaY > 0) next();
        if (e.deltaY < 0) prev();
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [selectedIndex]);

  return (
    <div className="min-h-screen bg-[#17388E] text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          className="mb-6 text-white underline hover:text-pink-400"
          onClick={() => navigate('/gallery')}
        >
          ← Back to Gallery
        </button>

        <h1 className="text-4xl font-bold text-center mb-10 capitalize">
          {projectFolder?.replace(/-/g, ' ')}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="cursor-pointer overflow-hidden rounded-xl shadow-lg group"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="w-full h-80 object-cover object-top group-hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-6xl w-full p-4"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-pink-400"
              >
                &times;
              </button>

              {/* Left arrow */}
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white text-3xl p-1 rounded-full z-10"
              >
                ←
              </button>

              {/* Right arrow */}
              <button
                onClick={next}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white text-3xl p-1 rounded-full z-10"
              >
                →
              </button>

              {/* Animated image preview */}
              <div className="relative flex items-center justify-center w-full h-[80vh] overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={selectedIndex}
                    src={images[selectedIndex]}
                    alt={`Image ${selectedIndex}`}
                    className="max-w-full max-h-[80vh] object-contain rounded shadow-lg absolute"
                    custom={direction}
                    initial={{ x: direction === 1 ? 150 : -150, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction === 1 ? -150 : 150, opacity: 0 }}
                    transition={{
                        duration: 0.25,
                        ease: [0.4, 0, 0.2, 1], // Custom easing for a smoother transition
                    }}
                    />
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
