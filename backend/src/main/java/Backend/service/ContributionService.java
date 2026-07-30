package Backend.service;

import Backend.entity.Contribution;

import java.util.List;

public interface ContributionService {

    Contribution contribute(Contribution contribution);
    List<Contribution> getContributions(Long projectId);
    List<Contribution> getUserContributions(Long userId);
}
