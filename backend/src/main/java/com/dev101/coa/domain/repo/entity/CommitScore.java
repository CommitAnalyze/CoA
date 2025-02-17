package com.dev101.coa.domain.repo.entity;

import com.dev101.coa.domain.repo.dto.CommitScoreDto;
import com.dev101.coa.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class CommitScore extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commitScoreId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo_view_id", nullable = false)
    private RepoView repoView;


    private Short scoreReadability;

    private Short scorePerformance;

    private Short scoreReusability;

    private Short scoreTestability;

    private Short scoreException;

    private Short scoreTotal;

    @Column(columnDefinition = "TEXT")
    private String scoreComment;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CommitScore other)) return false;
        return Objects.equals(repoView, other.getRepoView());
    }

    @Override
    public int hashCode() {
        return Objects.hash(repoView);
    }

    public CommitScoreDto converToDto(){
        return CommitScoreDto.builder()
                .readability(this.scoreReadability)
                .performance(this.scorePerformance)
                .reusability(this.scoreReusability)
                .testability(this.scoreTestability)
                .exception(this.scoreException)
                .total(this.scoreTotal)
                .scoreComment(this.scoreComment)
                .build();
    }

}
