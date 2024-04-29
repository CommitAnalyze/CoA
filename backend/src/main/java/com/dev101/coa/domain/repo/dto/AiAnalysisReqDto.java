package com.dev101.coa.domain.repo.dto;

import lombok.Builder;

@Builder
public class AiAnalysisReqDto {
    private String repoUrl;
    private String userName;
    private Long memberId;
    private Boolean isOwn;
}
