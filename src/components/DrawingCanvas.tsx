import React, { useRef, useState, useEffect } from 'react';
import { getStroke } from 'perfect-freehand';
import { useStore } from '../store';

interface Props {
  chapterId: string;
  subchapterId: string;
}

export function DrawingCanvas({ chapterId, subchapterId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<number[][]>([]);
  const addDrawing = useStore(state => state.addDrawing);

  const options = {
    size: 8,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
  }, []);

  const draw = (points: number[][]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const stroke = getStroke(points, options);
    
    if (stroke.length > 0) {
      ctx.beginPath();
      ctx.moveTo(stroke[0][0], stroke[0][1]);
      
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i][0], stroke[i][1]);
      }
      
      ctx.stroke();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    const point = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    setCurrentPoints([point]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    
    const point = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    setCurrentPoints(points => {
      const newPoints = [...points, point];
      draw(newPoints);
      return newPoints;
    });
  };

  const handlePointerUp = () => {
    if (currentPoints.length > 0) {
      addDrawing(chapterId, subchapterId, currentPoints);
    }
    setIsDrawing(false);
    setCurrentPoints([]);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border border-gray-300 rounded-lg touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}