from typing import Any

import requests

from api.models.services.client import RestRepoClient


class GitLabClient(RestRepoClient):
    """
    GitLab에서 파일, 커밋 데이터를 가져오기 위한 클라이언트입니다.
    """

    def __init__(self, base_url: str, project_id: int, private_token: str | None = None):
        """
        GitLab 클라이언트를 만듭니다.

        Parameters:
            base_url: GitLab 저장소 기본 URL (예: https://github.example.com)
            project_id: GitLab Project ID
        """
        self.base_url = base_url
        self.project_id = project_id
        self.private_token = private_token

    async def _request_json(self, url: str) -> Any:
        """
        특정 URL로 JSON 파일을 요청합니다.

        Parameters:
            url: 요청을 보낼 URL

        Returns:
            커밋 목록 JSON 객체
        """
        headers = {}
        if self.private_token is not None:
            headers['PRIVATE-TOKEN'] = self.private_token

        response = requests.get(url=url, headers=headers)
        response.raise_for_status()  # Raise an exception for 4XX and 5XX status codes
        return response.json()

    def _get_commits_root_url(self, author_name: str) -> str:
        """
        커밋 목록을 가져올 수 있는 API의 Root URL을 반환합니다.

        Parameters:
            author_name: 커밋 작성자 이름

        Returns:
            커밋 목록을 가져올 수 있는 API의 Root URL
        """
        return f'{self.base_url}/api/v4/projects/{self.project_id}/repository/commits?author={author_name}'

    def _get_commit_id_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 ID를 가져옵니다.

        Parameters:
            commit_json: 커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 ID
        """
        return commit_json["id"]

    def _get_diff_url_from_commit(self, commit_json: Any) -> str:
        """
        커밋 목록 JSON의 하나의 커밋에서 커밋 상세 URL을 가져옵니다.

        Parameters:
            commit_json: 커밋 목록 JSON에서 표현되는 하나의 커밋 JSON

        Returns:
            커밋 URL
        """
        commit_id = self._get_commit_id_from_commit(commit_json)
        return f'{self.base_url}/api/v4/projects/{self.project_id}/repository/commits/{commit_id}/diff'

    def _get_files_from_diff(self, diff_json: Any) -> list[Any]:
        """
        커밋 상세 JSON에서 파일 정보 리스트를 가져옵니다.

        Parameters:
            diff_json: 커밋 상세 JSON

        Returns:
            파일 정보 JSON 객체 리스트
        """
        return diff_json

    def _get_patch_from_file(self, file_json: Any) -> str:
        """
        커밋 상세 정보의 파일 정보에서 변경 내용(patch)를 가져옵니다.

        Parameters:
            file_json: 커밋 상세 JSON

        Returns:
            변경 내용
        """
        return file_json['diff']
