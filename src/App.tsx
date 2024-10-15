import React, { useRef, useState, useEffect } from 'react';
import { Palette, Eraser, Trash2 } from 'lucide-react';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [isEraser, setIsEraser] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 80; // Adjust for the control panel height
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 80;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { x, y } = getPointerPos(e);
    setLastPosition({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPointerPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
    return { x: 0, y: 0 };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const { x, y } = getPointerPos(e);
      
      ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
      ctx.lineWidth = brushSize;
      
      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      setLastPosition({ x, y });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white flex flex-col">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className="touch-none flex-grow"
      />
      <div className="h-20 bg-black bg-opacity-80 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 rounded-full cursor-pointer border-2 border-white"
          />
          <Palette className="text-white" size={28} />
          <div className="flex flex-col">
            <input
              type="range"
              min="0"
              max="25"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-48 accent-white"
            />
            <span className="text-white text-sm">{brushSize}px</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-3 rounded-full ${
              isEraser ? 'bg-white' : 'bg-gray-700'
            } text-black`}
          >
            <Eraser size={28} />
          </button>
          <button
            onClick={clearCanvas}
            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
          >
            <Trash2 size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;