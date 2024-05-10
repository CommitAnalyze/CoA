package com.dev101.coa.domain.repo.controller;

import com.dev101.coa.domain.repo.dto.*;
import com.dev101.coa.domain.repo.service.RepoService;
import com.dev101.coa.global.common.BaseResponse;
import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.dev101.coa.global.security.oauth2user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Repo Controller", description = "Repo와 관련된 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/repos")
public class RepoController {

    private final RepoService repoService;

    @Operation(description = "리드미 수정")
    @PutMapping("/readme/{repoViewId}")
    public ResponseEntity<BaseResponse<Object>> editReadme (
            @AuthenticationPrincipal Long currentMemberId
            , @PathVariable("repoViewId") Long repoViewId
            , @RequestBody String editReadmeReq) {
        repoService.editReadme(currentMemberId, repoViewId, editReadmeReq);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @Operation(description = "코멘트 수정")
    @PutMapping("/comments/{repoViewId}")
    public ResponseEntity<BaseResponse<Object>> editCommentList(
            @AuthenticationPrincipal Long currentMemberId
            , @PathVariable("repoViewId") Long repoViewId
            , @RequestBody List<CommitCommentDto> editCommentListReq){
        currentMemberId = 7L;
        repoService.editComment(currentMemberId, repoViewId,editCommentListReq);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }

    @Operation(description = "레포카드 수정")
    @PutMapping("/repoCard/{repoViewId}")
    public ResponseEntity<BaseResponse<Object>> editRepoCard(
            @AuthenticationPrincipal Long currentMemberId
            , @PathVariable("repoViewId") Long repoViewId
            , @RequestBody RepoCardEditReqDto repoCardEditReqDto){
        repoService.editRepoCard(currentMemberId, repoViewId, repoCardEditReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }


    @Operation(description = "분석 결과 저장")
    @PostMapping("/{analysisId}")
    public ResponseEntity<BaseResponse<Long>> saveAnalysis(
            @AuthenticationPrincipal Long currentMemberId,
            @PathVariable("analysisId") String analysisId,
            @RequestBody SaveAnalysisReqDto saveAnalysisReqDto) {
        Long result = repoService.saveAnalysis(currentMemberId, analysisId, saveAnalysisReqDto);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @Operation(description = "분석 요청")
    @PostMapping("/analysis")
    public ResponseEntity<BaseResponse<String>> startAnalysis(
            @AuthenticationPrincipal Long currentMemberId,
            @RequestBody AnalysisReqDto analysisReqDto) throws Exception {

        currentMemberId = 7L;
        String analysisId = null;
        try {
            analysisId = repoService.startAnalysis(currentMemberId, analysisReqDto);
        } catch (Exception e) {
            System.out.println("e.getMessage() = " + e.getMessage());
            throw new BaseException(StatusCode.UNAUTHORIZED_API_ERROR);
        }
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<String>(analysisId));
    }

    @Operation(description = "분석 진척도 체크")
    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<BaseResponse<AnalysisCheckResDto>> checkAnalysis(
            @AuthenticationPrincipal Long currentMemberId,
            @PathVariable("analysisId") String analysisId) {

        AnalysisCheckResDto result = repoService.checkAnalysis(currentMemberId, analysisId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }


    @Operation(description = "완료된 분석 결과 가져오기")
    @GetMapping("/analysis/done/{analysisId}")
    public ResponseEntity<BaseResponse<RepoDetailResDto>> getDoneAnalysis(
            @AuthenticationPrincipal Long currentMemberId,
            @PathVariable("analysisId") String analysisId) {

        RepoDetailResDto result = repoService.getDoneAnalysis(currentMemberId, analysisId);
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }

    @Operation(description = "특정 레포 뷰 조회")
    @GetMapping("/{repoViewId}")
    public ResponseEntity<BaseResponse<RepoDetailResDto>> readRepoView(
            @AuthenticationPrincipal Long currentMemberId,
            @PathVariable("repoViewId") Long repoViewId){

        currentMemberId = 7L;
        RepoDetailResDto result = repoService.readRepoView(currentMemberId, repoViewId);

        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(result));
    }


    @Operation(description = "더미데이터 주입을 위한 컨트롤러! 무시해도 됩니다!")
    @GetMapping("/test")
    public ResponseEntity<BaseResponse<Object>> test() {
        repoService.test();
        return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse<>(StatusCode.SUCCESS));
    }
}