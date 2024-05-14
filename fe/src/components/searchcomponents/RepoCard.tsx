import React from 'react';
import Link from 'next/link';
import tw from 'tailwind-styled-components';

// 타입 정의
interface Skill {
  codeId: number;
  codeName: string;
}

interface RepoCardDto {
  memberUuid: string;
  memberNickname: string;
  memberImg: string;
  repoViewId: number;
  repoViewPath: string;
  repoViewTitle: string;
  repoViewSubtitle: string;
  repoMemberCnt: number;
  skillList: Skill[];
  repoStartDate: string;
  repoEndDate: string;
  isMine: boolean;
}

interface ResultDTO {
  data: RepoCardDto;
}



const RepoCard: React.FC<ResultDTO> = ( data ) => {
  const result = data.data;
  const skill = data.data.skillList;
  return (
    <RepoInfoDiv>
      <Header>
        <div className="flex items-center">
          {result.repoViewPath.includes("github") ? (
            <ProfileImg
              src="/image/githubSSO.svg"
              alt="github logo"
            />
          ) : (
            <ProfileImg
              src="/image/gitlabSSO.svg"
              alt="gitlab logo"
            />
          )}
          <Link href={result.repoViewPath} className="font-bold truncate">
            <Title>{result.repoViewTitle}</Title>
          </Link>
        </div>
        <div className="flex items-center">
          <ProfileImg
            src={result.memberImg}
            alt="member image"
          />
          <p className="ml-2 font-bold">{result.memberNickname}</p>
        </div>
      </Header>
      <Body>
        <p className="text-xl mb-2 truncate">{result.repoViewSubtitle}</p>
        <p className="font-bold">
          프로젝트 기간: {`${result.repoStartDate} ~ ${result.repoEndDate}`}
        </p>
      </Body>
      <div className="flex flex-wrap">
        {skill.map((skill: Skill, index: number) => (
          <span key={index} className="m-1 bg-gray-200 rounded-full px-4 py-1 text-sm">
            {skill.codeName}
          </span>
        ))}
      </div>
    </RepoInfoDiv>
  );
};

const RepoInfoDiv = tw.div`
  relative
  w-full
  min-h-20
  lg:flex-row
  flex-wrap
  justify-between
  shadow-lg
  bg-white
  rounded-2xl
  p-5
  space-y-2
`;

const Header = tw.div`
  flex
  justify-between
  items-center
  mb-5
`;

const ProfileImg = tw.img`
  rounded-full
  mr-2
  h-10
  w-10
`;

const Title = tw.p`
  font-bold
  truncate
  ml-2
  text-xl
`

const Body = tw.div`
  mb-5
`;

export default RepoCard;
