import { useState, useRef, useEffect } from "react";
import useRepoDetailStore from "@/store/repodetail";
import CommitRate from "@/app/repo/[id]/_components/CommitRate";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ResultCommit() {
  const repo = useRepoDetailStore.getState().result.repoCardDto;
  const result = useRepoDetailStore.getState().result.basicDetailDto;
  const commentList = result.commentList;
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const parts = splitTextByComments(
    result.repoViewResult,
    commentList as Comment[],
  );

  const handleCommentClick = (comment: Comment, event: React.MouseEvent) => {
    if (
      currentComment &&
      currentComment.commentContent === comment.commentContent
    ) {
      setCurrentComment(null);
      setModalPosition(null);
    } else {
      setCurrentComment(comment);
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setModalPosition({
        top: rect.top - 10,
        left: rect.left + rect.width / 2,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currentComment &&
        !document
          .querySelector(".modal-content")
          ?.contains(event.target as Node)
      ) {
        setCurrentComment(null);
        setModalPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentComment]);

  const totalLineCount = result.repoLineCntList.reduce(
    (acc, line) => acc + line.lineCnt,
    0,
  );

  const pieData = {
    labels: result.repoLineCntList.map((line) => line.codeName),
    datasets: [
      {
        data: result.repoLineCntList.map((line) => line.lineCnt),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} 줄`;
          },
        },
      },
    },
    cutout: "40%", // 도넛 형태로 만들기 위해 중앙 부분을 비웁니다.
  };

  return (
    <div className="flex flex-col w-full justify-between">
      <div className="flex flex-col justify-between items-center min-h-80">
        <CommitRate />
        <div className="w-full max-w-[80%] sm:max-w-[40%] min-h-[300px] flex flex-col items-center justify-center relative">
          <Pie data={pieData} options={pieOptions} />
          <div className="">
            <p className="font-bold my-4">
              전체 코드 :{" "}
              {<span className="text-appBlue1">{totalLineCount} </span>}줄
            </p>
          </div>
        </div>
      </div>
      <p className="text-base sm:text-xl lg:text-2xl mt-2">
        <span className="text-appBlue1">{repo.memberNickname}</span> 님의{" "}
        <span className="text-appBlue1">{repo.repoViewTitle}</span> 프로젝트
        분석결과
      </p>
      <div className="flex justify-center items-center w-full min-h-20 bg-white shadow-lg rounded-lg mt-2 text-xl lg:text-xl">
        <div className="w-full flex justify-center">
          {parts.map((part, index) =>
            part.isComment ? (
              <span
                key={index}
                className="text-appBlue1 relative cursor-pointer"
                onClick={(event) =>
                  part.comment && handleCommentClick(part.comment, event)
                }
                style={{ whiteSpace: "pre-wrap" }} // 공백을 유지하기 위한 스타일 추가
              >
                {part.text}
                {currentComment &&
                  part.comment &&
                  currentComment.commentContent ===
                    part.comment.commentContent &&
                  modalPosition && (
                    <div
                      className="absolute bg-white p-4 shadow-lg rounded-lg border border-gray-300 text-gray-800 text-left min-w-[350px] w-fit break-words cursor-pointer modal-content"
                      onClick={() => setCurrentComment(null)}
                    >
                      <p className="font-semibold w-full">{`${currentComment.commentTargetString} 코멘트`}</p>
                      <p className="mt-2 text-sm">{`${currentComment.commentContent}`}</p>
                    </div>
                  )}
              </span>
            ) : (
              <span key={index} style={{ whiteSpace: "pre-wrap" }}>
                {part.text}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function splitTextByComments(text: string, comments: Comment[]) {
  let lastEnd = 0;
  const parts: { text: string; isComment: boolean; comment?: Comment }[] = [];

  if (!comments) {
    comments = [];
  } else {
    comments = comments.filter((comment) => comment != null);
  }

  comments.sort((a, b) => a.commentStartIndex - b.commentStartIndex);

  comments.forEach((comment) => {
    if (comment.commentStartIndex > lastEnd) {
      parts.push({
        text: text.slice(lastEnd, comment.commentStartIndex),
        isComment: false,
      });
    }
    parts.push({
      text: text.slice(comment.commentStartIndex, comment.commentEndIndex),
      isComment: true,
      comment: comment,
    });
    lastEnd = comment.commentEndIndex;
  });

  if (lastEnd < text.length) {
    parts.push({
      text: text.slice(lastEnd),
      isComment: false,
    });
  }

  return parts;
}

interface Comment {
  commentStartIndex: number;
  commentEndIndex: number;
  commentContent: string;
  commentTargetString: string;
}
