package Backend.service.impl;

import Backend.entity.Contribution;
import Backend.entity.Project;
import Backend.repository.ContributionRepository;
import Backend.repository.ProjectRepository;
import Backend.service.ContributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContributionServiceImpl implements ContributionService {

    @Autowired
    private ContributionRepository contributionRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Contribution contribute(Contribution contribution) {

        Project project = contribution.getProject();

        Project dbProject = projectRepository.findById(project.getId()).orElse(null);

        if (dbProject != null) {

            dbProject.setCurrentAmount(
                    dbProject.getCurrentAmount() + contribution.getAmount()
            );

            projectRepository.save(dbProject);
        }

        return contributionRepository.save(contribution);
    }

    @Override
    public List<Contribution> getContributions(Long projectId) {

        return contributionRepository.findByProjectId(projectId);

    }
    @Override
    public List<Contribution> getUserContributions(Long userId) {

        return contributionRepository.findByUserId(userId);

    }
}