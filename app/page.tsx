import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-5xl text-bright-yellow leading-tight">
          나만의 교육용 웹앱 만들기
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          쉽고 재미있게! 16비트 감성으로 학생들의 집중도를 높여보세요.
          여기에 다양한 기능을 자유롭게 추가할 수 있습니다.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/sieve">
          <button className="pixel-btn bg-pixel-pink text-white px-8 py-4 text-xl flex items-center gap-3 hover:bg-opacity-90 w-full sm:w-auto justify-center">
            <Gamepad2 size={24} />
            <span>에라토스테네스의 체</span>
          </button>
        </Link>
        <Link href="/equation-quiz">
          <button className="pixel-btn bg-blue-600 text-white px-8 py-4 text-xl flex items-center gap-3 hover:bg-opacity-90 w-full sm:w-auto justify-center">
            <Gamepad2 size={24} />
            <span>일차방정식 퀴즈</span>
          </button>
        </Link>
      </div>

      {/* 추가 설명을 위한 박스 예시 */}
      <div className="pixel-border p-6 max-w-lg mt-12 bg-gray-900 text-left">
        <h3 className="text-neon-green mb-4 text-xl">선생님을 위한 안내</h3>
        <p className="text-sm text-gray-400 leading-relaxed space-y-2">
          이 코드는 읽고 수정하기 쉽게 작성되었습니다. <br />
          <span className="text-white bg-black px-1">app/page.tsx</span> 파일을 열어 새로운 컴포넌트나
          기능을 추가해 보세요!
        </p>
      </div>
    </div>
  );
}
