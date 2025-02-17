package com.dev101.coa.domain.repo.entity;

import com.dev101.coa.domain.member.entity.Member;
import com.dev101.coa.domain.repo.dto.RepoCardEditReqDto;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class RepoView extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long repoViewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo_id", nullable = false)
    private Repo repo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String repoViewReadme;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String repoViewResult;

    private Long repoViewCommitCnt;

    @Column(length = 200)
    private String repoViewTitle;

    @Column(length = 255)
    private String repoViewSubtitle;

    @Column(name = "repoView_member_cnt")
    private Integer repoViewMemberCnt;

    @Column(name = "repo_start_date")
    private LocalDate repoStartDate;

    @Column(name = "repo_end_date")
    private LocalDate repoEndDate;


    // 참조를 쉽게 하기 위해 양방향 매핑을 함
    @OneToMany(mappedBy = "repoView")
    List<Comment> commentList;

    @OneToMany(mappedBy = "repoView")
    List<RepoViewSkill> repoViewSkillList;



    // repoViewReadme update
    public void updateReadme(String readme){
        this.repoViewReadme = readme;
    }

    public void updateCommentList(List<Comment> commentList){
        this.commentList = commentList;
    }

    public void updateCodeList(List<RepoViewSkill> repoViewSkillList){
        this.repoViewSkillList = repoViewSkillList;
    }

    public void updateRepoCard(RepoCardEditReqDto repoCardEditReqDto) {
        this.repoViewTitle = repoCardEditReqDto.getRepoViewTitle();
        this.repoViewSubtitle = repoCardEditReqDto.getRepoViewSubtitle();
        this.repoStartDate = repoCardEditReqDto.getRepoStartDate();
        this.repoEndDate = repoCardEditReqDto.getRepoEndDate();
        this.repoViewMemberCnt = repoCardEditReqDto.getRepoMemberCnt();
    }
}
