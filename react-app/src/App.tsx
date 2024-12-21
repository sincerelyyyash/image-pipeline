import { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from './components/Canvas';
import { Images } from 'lucide-react';

function App() {
  const [images, setImages] = useState<{ original: string; mask: string } | null>(null);

  const handleMaskGenerated = (original: string, mask: string) => {
    setImages({ original, mask });
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-zinc-900 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Images className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Image Inpainting Widget</h1>
          </div>

          <Canvas onMaskGenerated={handleMaskGenerated} />
        </div>

        {images && (
          <motion.div
            className="bg-zinc-900 rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Generated Images</h2>
            <div className="grid grid-cols-2 gap-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-lg font-medium text-white mb-2">Original Image</h3>
                <img
                  src={images.original}
                  alt="Original"
                  className="w-full rounded-lg border border-zinc-700"
                />
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="text-lg font-medium text-white mb-2">Mask</h3>
                <img
                  src={images.mask}
                  alt="Mask"
                  className="w-full rounded-lg border border-zinc-700"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;

