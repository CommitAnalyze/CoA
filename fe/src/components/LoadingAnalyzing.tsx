"use client";

import useAnalyzingStore from "@/store/analyze";

export default function LoadingAnalyzing() {
  const {
    isAnalyzing,
    isCompleted,
    analyzingPercent,
    startAnalysis,
    completeAnalysis,
    resetAnalysis,
  } = useAnalyzingStore((state) => state);
  return (
    <div>
      {/* 테스트 버튼(상태 변경용) */}
      {/* <button onClick={startAnalysis}>분석 시작</button>
      <button onClick={completeAnalysis}>분석 종료</button>
      <button onClick={resetAnalysis}>초기화</button> */}
      {/* 테스트 버튼(상태 변경용) */}
      {isAnalyzing && (
        <div>
          {isCompleted ? (
            <p>완료</p>
          ) : (
            <span className="flex justify-center items-center">
              <img
                src="/image/LoadingSpinner.gif"
                alt="로딩스피너"
                width={20}
                height={40}
              />
              <p className="ml-2">분석중 : {analyzingPercent}%</p>
            </span>
          )}
        </div>
      )}
    </div>
  );
}