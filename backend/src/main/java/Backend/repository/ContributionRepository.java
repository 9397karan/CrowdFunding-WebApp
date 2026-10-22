package Backend.repository;

import Backend.entity.Contribution;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContributionRepository
        extends JpaRepository<Contribution, Long> {

    List<Contribution> findByProjectId(Long projectId);

    List<Contribution> findByUserId(Long userId);

    void deleteByProjectId(Long projectId);
}