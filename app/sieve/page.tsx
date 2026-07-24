"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, StepForward, Pause } from "lucide-react";

type CellStatus = "default" | "prime" | "deleted";

interface Cell {
  num: number;
  status: CellStatus;
}

const MAX_NUM = 100;

export default function SievePage() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [currentP, setCurrentP] = useState(2);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [message, setMessage] = useState("2부터 100까지의 소수를 찾아봅시다!");

  useEffect(() => {
    resetSieve();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && !isFinished) {
      timer = setTimeout(() => {
        nextStep();
      }, 100); // 0.1s interval for faster auto play
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentP, currentIndex, cells, isFinished]);

  const resetSieve = () => {
    const initialCells: Cell[] = Array.from({ length: MAX_NUM - 1 }, (_, i) => ({
      num: i + 2,
      status: "default",
    }));
    setCells(initialCells);
    setCurrentP(2);
    setCurrentIndex(-1);
    setIsAutoPlaying(false);
    setIsFinished(false);
    setMessage("2부터 100까지의 소수를 찾아봅시다!");
  };

  const nextStep = () => {
    if (isFinished) return;

    setCells((prev) => {
      const newCells = [...prev];
      
      // If we haven't started with currentP yet
      if (currentIndex === -1) {
        if (currentP * currentP > MAX_NUM) {
          // Finish: mark all remaining defaults as prime
          newCells.forEach(c => {
            if (c.status === "default") c.status = "prime";
          });
          setIsFinished(true);
          setIsAutoPlaying(false);
          setMessage("모든 소수를 찾았습니다! (초록색이 소수입니다)");
          return newCells;
        }

        const pIndex = newCells.findIndex(c => c.num === currentP);
        if (newCells[pIndex].status === "deleted") {
          // If currentP is already deleted, just move to next
          setCurrentP(p => p + 1);
          return prev; // No change in cells
        }

        // Mark currentP as prime
        newCells[pIndex].status = "prime";
        setMessage(`${currentP}는 소수입니다. 이제 ${currentP}의 배수를 지웁니다.`);
        setCurrentIndex(currentP * 2);
        return newCells;
      }

      // Deleting multiples
      if (currentIndex <= MAX_NUM) {
        const mulIndex = newCells.findIndex(c => c.num === currentIndex);
        if (mulIndex !== -1 && newCells[mulIndex].status === "default") {
          newCells[mulIndex].status = "deleted";
        }
        setCurrentIndex(prevIndex => prevIndex + currentP);
        return newCells;
      }

      // Finished multiples for currentP
      setCurrentP(p => p + 1);
      setCurrentIndex(-1);
      return newCells;
    });
  };

  const getCellColor = (status: CellStatus) => {
    switch (status) {
      case "prime": return "bg-neon-green text-black border-neon-green";
      case "deleted": return "bg-gray-800 text-gray-500 border-gray-700 opacity-30";
      default: return "bg-black text-white border-white hover:bg-gray-800";
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <button className="pixel-btn bg-black text-white px-4 py-2 flex items-center gap-2">
            <ArrowLeft size={20} />
            <span className="text-sm">BACK</span>
          </button>
        </Link>
        <h2 className="text-2xl md:text-3xl text-pixel-pink hidden sm:block">에라토스테네스의 체</h2>
        <div className="w-[88px] hidden sm:block"></div>
      </div>

      <div className="pixel-border p-4 mb-8 bg-gray-900 text-center min-h-[80px] flex items-center justify-center">
        <p className="text-lg md:text-xl text-bright-yellow">{message}</p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button 
          onClick={nextStep}
          disabled={isFinished || isAutoPlaying}
          className="pixel-btn bg-blue-600 text-white px-6 py-3 flex items-center gap-2 disabled:opacity-50"
        >
          <StepForward size={20} />
          <span>Next Step</span>
        </button>
        <button 
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          disabled={isFinished}
          className="pixel-btn bg-neon-green text-black px-6 py-3 flex items-center gap-2 disabled:opacity-50"
        >
          {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
          <span>{isAutoPlaying ? "Pause" : "Auto Play"}</span>
        </button>
        <button 
          onClick={resetSieve}
          className="pixel-btn bg-red-600 text-white px-6 py-3 flex items-center gap-2"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 md:gap-3 pb-8">
        {cells.map((cell) => (
          <div 
            key={cell.num}
            className={`
              pixel-border flex items-center justify-center
              h-12 md:h-14 lg:h-16 text-lg md:text-xl transition-all duration-300
              ${getCellColor(cell.status)}
              ${currentIndex === cell.num ? 'scale-110 shadow-[0_0_15px_#ffff00] border-bright-yellow z-10' : ''}
            `}
          >
            {cell.num}
          </div>
        ))}
      </div>
    </div>
  );
}
