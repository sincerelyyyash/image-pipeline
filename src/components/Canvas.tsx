import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Minus, Plus, Trash2, Download } from 'lucide-react';

interface CanvasProps {
  onMaskGenerated: (original: string, mask: string) => void;
}

export function Canvas({ onMaskGenerated }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: 512,
        height: 512,
      });

      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = 'white';
      fabricCanvas.freeDrawingBrush.width = brushSize;

      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize, canvas]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      setOriginalImage(imgUrl);

      fabric.Image.fromURL(imgUrl, (img) => {
        canvas.clear();
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width! / img.width!,
          scaleY: canvas.height! / img.height!,
        });
      });
    };
    reader.readAsDataURL(file);
  };

  const clearCanvas = () => {
    if (!canvas || !originalImage) return;

    fabric.Image.fromURL(originalImage, (img) => {
      canvas.clear();
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width! / img.width!,
        scaleY: canvas.height! / img.height!,
      });
    });
  };

  const generateMask = () => {
    if (!canvas || !originalImage) return;

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width!;
    maskCanvas.height = canvas.height!;
    const ctx = maskCanvas.getContext('2d')!;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    const drawingCanvas = document.createElement('canvas');
    drawingCanvas.width = canvas.width!;
    drawingCanvas.height = canvas.height!;
    canvas.getObjects().forEach(obj => {
      obj.render(ctx);
    });

    const maskImage = maskCanvas.toDataURL('image/png');
    onMaskGenerated(originalImage, maskImage);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4 items-center">
        <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBrushSize(Math.max(1, brushSize - 5))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="w-12 text-center">{brushSize}px</span>
          <button
            onClick={() => setBrushSize(Math.min(100, brushSize + 5))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={clearCanvas}
          className="p-2 hover:bg-gray-100 rounded"
          title="Clear mask"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <button
          onClick={generateMask}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          <Download className="w-5 h-5" />
          Generate Mask
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
