import repositoryStore from "@/store/repos";
import MyPageRepositoryCard from "./MyPageRepositoryCard";
import HistoryCard from "../../_components/HistoryCard";

export default function UserRepositoryPage() {
  const repos = repositoryStore((state) => state.repos);
  return (
    <>
      <HistoryCard />
      <ul className="grid gap-3">
        {repos.map((repo, index) => (
          <li key={index}>
            <MyPageRepositoryCard repo={repo} />
          </li>
        ))}
      </ul>
    </>
  );
}