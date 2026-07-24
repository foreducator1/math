"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Save, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

type GameState = "start" | "playing" | "gameover" | "leaderboard";

interface Question {
  a: number;
  b: number;
  c: number;
  answer: number; // x
}

interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
}

const TOTAL_QUESTIONS = 5;

export default function EquationQuizPage() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [nickname, setNickname] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [feedback, setFeedback] = useState("");

  const generateQuestions = () => {
    const newQuestions: Question[] = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      // ax + b = c
      // a: 1~9, x: -9~9, b: -20~20
      const a = Math.floor(Math.random() * 9) + 1;
      const x = Math.floor(Math.random() * 19) - 9;
      const b = Math.floor(Math.random() * 41) - 20;
      const c = a * x + b;
      newQuestions.push({ a, b, c, answer: x });
    }
    setQuestions(newQuestions);
  };

  const startGame = () => {
    generateQuestions();
    setCurrentQIndex(0);
    setScore(0);
    setUserAnswer("");
    setFeedback("");
    setStartTime(Date.now());
    setGameState("playing");
  };

  const submitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer) return;

    const currentQ = questions[currentQIndex];
    const isCorrect = parseInt(userAnswer, 10) === currentQ.answer;

    if (isCorrect) {
      setScore(prev => prev + 100);
      setFeedback("정답입니다! +100점");
    } else {
      setFeedback(`오답입니다! 정답은 ${currentQ.answer}입니다.`);
    }

    setTimeout(() => {
      setFeedback("");
      setUserAnswer("");
      if (currentQIndex + 1 < TOTAL_QUESTIONS) {
        setCurrentQIndex(prev => prev + 1);
      } else {
        endGame();
      }
    }, 1500);
  };

  const endGame = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // in seconds
    // Time bonus: max 500, decreases by 10 per second
    const timeBonus = Math.max(0, 500 - Math.floor(timeTaken * 10));
    setScore(prev => prev + timeBonus);
    setGameState("gameover");
  };

  const saveScore = async () => {
    if (!nickname.trim()) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from("equation_scores").insert([
        { nickname: nickname.trim(), score: score }
      ]);
      
      if (error) {
        console.error("Error saving score:", error);
        alert("점수 저장에 실패했습니다. 환경 변수를 확인해주세요.");
      } else {
        fetchLeaderboard();
        setGameState("leaderboard");
      }
    } catch (err) {
      console.error(err);
      alert("데이터베이스 연결에 문제가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("equation_scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);
      
      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else if (data) {
        setLeaderboard(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const skipSave = () => {
    fetchLeaderboard();
    setGameState("leaderboard");
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-2xl mx-auto w-full justify-center">
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <button className="pixel-btn bg-black text-white px-4 py-2 flex items-center gap-2">
            <ArrowLeft size={20} />
            <span className="text-sm">BACK</span>
          </button>
        </Link>
        <h2 className="text-2xl text-neon-green hidden sm:block">일차방정식 퀴즈</h2>
        <div className="w-[88px] hidden sm:block"></div>
      </div>

      {gameState === "start" && (
        <div className="pixel-border p-8 bg-gray-900 text-center space-y-8">
          <Trophy size={64} className="mx-auto text-bright-yellow mb-4" />
          <h3 className="text-2xl text-white">방정식을 풀고 점수를 등록하세요!</h3>
          <p className="text-gray-400">
            총 {TOTAL_QUESTIONS}문제가 출제됩니다.<br/>
            빠르고 정확하게 풀수록 더 높은 점수를 얻습니다.
          </p>
          <button 
            onClick={startGame}
            className="pixel-btn bg-pixel-pink text-white px-8 py-4 text-xl mx-auto flex items-center gap-3 hover:bg-opacity-90"
          >
            <Play size={24} />
            <span>게임 시작</span>
          </button>
          <button 
            onClick={() => { fetchLeaderboard(); setGameState("leaderboard"); }}
            className="text-gray-500 hover:text-white underline mt-4 block mx-auto"
          >
            리더보드만 보기
          </button>
        </div>
      )}

      {gameState === "playing" && questions.length > 0 && (
        <div className="pixel-border p-8 bg-gray-900 text-center space-y-8">
          <div className="flex justify-between text-gray-400">
            <span>문제 {currentQIndex + 1} / {TOTAL_QUESTIONS}</span>
            <span>현재 점수: {score}</span>
          </div>
          
          <div className="text-4xl md:text-6xl text-bright-yellow py-8 font-retro tracking-widest">
            {questions[currentQIndex].a === 1 ? "" : questions[currentQIndex].a === -1 ? "-" : questions[currentQIndex].a}x 
            {questions[currentQIndex].b >= 0 ? ` + ${questions[currentQIndex].b}` : ` - ${Math.abs(questions[currentQIndex].b)}`} 
            {" = "} 
            {questions[currentQIndex].c}
          </div>

          {feedback ? (
            <div className={`text-xl ${feedback.includes("정답") ? "text-neon-green" : "text-pixel-pink"}`}>
              {feedback}
            </div>
          ) : (
            <form onSubmit={submitAnswer} className="space-y-4">
              <div>
                <label className="text-xl text-white mr-4">x = </label>
                <input 
                  type="number" 
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="pixel-border bg-black text-white px-4 py-2 text-2xl w-32 outline-none focus:border-neon-green text-center"
                  autoFocus
                />
              </div>
              <button 
                type="submit"
                className="pixel-btn bg-blue-600 text-white px-8 py-3 text-lg mt-4 hover:bg-opacity-90"
              >
                정답 제출
              </button>
            </form>
          )}
        </div>
      )}

      {gameState === "gameover" && (
        <div className="pixel-border p-8 bg-gray-900 text-center space-y-8">
          <h3 className="text-3xl text-neon-green">게임 종료!</h3>
          <p className="text-xl text-white">당신의 최종 점수는</p>
          <div className="text-5xl text-bright-yellow animate-pulse">{score}</div>
          
          <div className="mt-8 space-y-4">
            <p className="text-gray-400">명예의 전당에 이름을 남기세요!</p>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력"
              maxLength={10}
              className="pixel-border bg-black text-white px-4 py-2 text-xl w-full max-w-xs outline-none focus:border-neon-green text-center"
            />
            <div className="flex gap-4 justify-center mt-4">
              <button 
                onClick={saveScore}
                disabled={isSaving || !nickname.trim()}
                className="pixel-btn bg-pixel-pink text-white px-6 py-3 flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                <span>{isSaving ? "저장 중..." : "점수 등록"}</span>
              </button>
              <button 
                onClick={skipSave}
                className="pixel-btn bg-gray-700 text-white px-6 py-3"
              >
                건너뛰기
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === "leaderboard" && (
        <div className="pixel-border p-6 md:p-8 bg-gray-900 text-center space-y-6">
          <Trophy size={48} className="mx-auto text-bright-yellow mb-2" />
          <h3 className="text-2xl text-white mb-6">명예의 전당 (Top 10)</h3>
          
          <div className="space-y-2 text-left bg-black p-4 pixel-border">
            {leaderboard.length === 0 ? (
              <p className="text-gray-500 text-center py-4">아직 등록된 랭킹이 없습니다.</p>
            ) : (
              leaderboard.map((entry, index) => (
                <div key={entry.id} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                  <span className={`text-lg ${index === 0 ? 'text-bright-yellow' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-700' : 'text-gray-500'}`}>
                    {index + 1}. {entry.nickname}
                  </span>
                  <span className="text-neon-green text-xl">{entry.score}</span>
                </div>
              ))
            )}
          </div>

          <button 
            onClick={() => setGameState("start")}
            className="pixel-btn bg-blue-600 text-white px-8 py-3 text-lg mt-6 hover:bg-opacity-90 w-full"
          >
            다시 하기
          </button>
        </div>
      )}
    </div>
  );
}
