import Image from "next/image";

export default function LoginPage() {

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'; // OAuth는 fetch나 axios로 보낼 시 무조건 CORS에 막히는 듯
  };

  // GitHub 로그인 버튼 클릭 시 이벤트 핸들러
  const handleGitHubLogin = () => {
  };


  return (
    <main className="flex justify-center items-center h-appVh">
      <div className="relative">
        <div className="absolute w-full h-full top-0 bg-gradient-to-b from-appBlue2 to-appBlue1 -rotate-6 z-0 rounded-2xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col xl:flex-row gap-10 justify-center items-center shadow-lg bg-white rounded-2xl p-8">
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src="/image/logo144.png"
                alt="logo"
                width={200}
                height={200}
              />
              <h1 className="text-3xl">시작하기</h1>
            </div>
            <div className="grid gap-2">
              <button className="flex gap-4 p-4 rounded-xl shadow-lg">
                <Image
                  src="/image/githubSSO.png"
                  alt="githubSSO"
                  width={24}
                  height={24}
                />
                Sign in with Github
              </button>
              <button className="flex gap-4 p-4 rounded-xl shadow-lg">
                <Image
                  src="/image/googleSSO.png"
                  alt="googleSSO"
                  width={24}
                  height={24}
                />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
