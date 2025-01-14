import base64
from typing import Any

import requests
from pathspec import PathSpec
from requests import Response

from api.models.code import AnalysisStatus
from api.models.dto import AnalysisRequest, GithubAnalysisRequest
from api.models.services.client import RestRepoClient
from exception import AnalysisException


class GithubRestClient(RestRepoClient[GithubAnalysisRequest]):
    """
    Github REST API에서 파일, 커밋 데이터를 가져오기 위한 클라이언트입니다.
    """

    def __init__(self, request: GithubAnalysisRequest, accept_spec: PathSpec, ignore_spec: PathSpec):
        """
        Github REST API 클라이언트를 만듭니다.

        Parameters:
            path: Github 저장소 경로 (예: DoubleDeltas/MineCollector)
        """
        super().__init__(request, accept_spec, ignore_spec)
        self.path = request.repoPath
        self.access_token = request.accessToken

    async def check_loadability(self, request: AnalysisRequest) -> AnalysisStatus | None:
        return None     # TODO - 일단은 항상 load할 수 있다고 생각합시다.

    async def _request_get(self, url: str) -> Response:
        """
        특정 URL로 HTTP GET 요청을 보냅니다.

        Parameters:
            url: 요청을 보낼 URL

        Returns:
            응답 객체
        """
        headers = {
            'X-GitHub-Api-Version': '2022-11-28'
        }
        if self.access_token is not None:
            headers['Authorization'] = f'Bearer {self.access_token}'

        return requests.get(url=url, headers=headers)

    async def load_content(self) -> list[dict[Any, Any]]:
        # TODO: 리팩토링은 나중에...
        # TODO: pagination

        result: list[dict[Any, Any]] = []

        # default branch 이름 가져오기
        repo_json = await self._request_json(f'https://api.github.com/repos/{self.path}')
        default_branch: str = repo_json['default_branch']

        # 모든 파일을 flat하게 가져오기
        git_trees_json = await self._request_json(
            f'https://api.github.com/repos/{self.path}/git/trees/{default_branch}?recursive=1'
        )
        for entry in git_trees_json['tree']:
            if entry['type'] == 'tree':     # 해당 entry는 directory
                continue
            path = entry['path']
            if not self.accept_spec.match_file(path): # 허용된 파일인지 검사
                continue
            if self.ignore_spec.match_file(path):  # 무시할 파일일지 검사
                continue

            # 내부 내용을 가져오자
            file_json = await self._request_json(entry['url'])

            try:
                encoded_content = file_json['content']
                decoded_content = base64.b64decode(encoded_content).decode('utf-8')

                result.append({
                    'file_path': entry['path'],
                    'file_content': decoded_content
                })

            except UnicodeDecodeError:  # binary file?
                continue

        return result

    def _get_commits_root_url(self, author_name: str) -> str:
        """
        커밋 목록을 가져올 수 있는 API의 Root URL을 반환합니다.

        Parameters:
            author_name: 커밋 작성자 이름

        Returns:
            커밋 목록을 가져올 수 있는 API의 Root URL
        """
        return f'https://api.github.com/repos/{self.path}/commits?author={author_name}'

    def _get_commit_id_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 ID를 가져옵니다.

        Parameters:
            commit_json: 커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 ID
        """
        return commit_json["sha"]

    def _get_diff_url_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 상세 URL을 가져옵니다.

        Parameters:
            commits_json: 커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 URL
        """
        commit_id = self._get_commit_id_from_commit(commit_json)
        return f'https://api.github.com/repos/{self.path}/commits/{commit_id}'

    def _get_files_from_diff(self, diff_json: Any) -> list[Any]:
        """
        커밋 상세 JSON에서 파일 정보 리스트를 가져옵니다.

        Parameters:
            diff_json: 커밋 상세 JSON

        Returns:
            파일 정보 JSON 객체 리스트
        """
        return diff_json['files']

    def _get_patch_from_file(self, file_json: Any) -> str | None:
        """
        커밋 상세 정보의 파일 정보에서 변경 내용(patch)를 가져옵니다.

        Parameters:
            file_json: 커밋 상세 JSON

        Returns:
            변경 내용
        """
        return file_json.get('patch', None)

    async def load_total_commit_cnt(self) -> int:
        """
        해당 레포에 총 커밋 개수를 불러옵니다.
        """
        url = f'https://api.github.com/repos/{self.path}/commits?per_page=1&page=1'
        try:
            return await self._load_page_cnt(url)
        except Exception:
            raise AnalysisException(AnalysisStatus.REPO_REQUEST_FAILED, msg="총 커밋 수 불러오기 실패")

    async def load_personal_commit_cnt(self, author_name: str) -> int:
        """
        해당 레포에 개인 커밋 개수를 불러옵니다.
        """
        url = f'https://api.github.com/repos/{self.path}/commits?per_page=1&page=1&author={author_name}'
        try:
            return await self._load_page_cnt(url)
        except Exception:
            raise AnalysisException(AnalysisStatus.REPO_REQUEST_FAILED, msg="개인 커밋 수 불러오기 실패")

    async def _load_page_cnt(self, url: str) -> int:
        response = await self._request_get(url)

        # link: <https://api.github.com/repositories/1300192/issues?page=2>; rel="prev", <https://api.github.com/repositories/1300192/issues?page=4>; rel="next", <https://api.github.com/repositories/1300192/issues?page=515>; rel="last", <https://api.github.com/repositories/1300192/issues?page=1>; rel="first"
        link = response.headers['Link']
        print(link)
        for section in link.split(', '):
            print(section)
            encased_url, rel_equals_rel = section.split('; ')
            if rel_equals_rel != 'rel="last"':
                continue
            rel_url = encased_url[1:-1]
            _, query_string = rel_url.split('?')
            queries = query_string.split('&')
            for query in queries:
                key, value = query.split('=')
                if key == 'page':
                    return int(value)

        raise Exception("응답 헤더 'link'에서 페이지 수 가져오기 실패")