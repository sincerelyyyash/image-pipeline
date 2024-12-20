import { useState } from 'react';
import { Canvas } from './components/Canvas';
import { Images } from 'lucide-react';

function App() {
  const [images, setImages] = useState<{ original: string; mask: string } | null>(null);

  const handleMaskGenerated = (original: string, mask: string) => {
    setImages({ original, mask });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Images className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Image Inpainting Widget</h1>
          </div>

          <Canvas onMaskGenerated={handleMaskGenerated} />
        </div>

        {images && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Generated Images</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Original Image</h3>
                <img
                  src={images.original}
                  alt="Original"
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Mask</h3>
                <img
                  src={images.mask}
                  alt="Mask"
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
