package Backend.service.impl;
import Backend.entity.Project;
import Backend.repository.ContributionRepository;
import Backend.repository.ProjectRepository;
import Backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Backend.repository.ProjectRepository;
import Backend.repository.ContributionRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    @Override
    public List<Project> getProjectsByCreator(Long creatorId) {

        return projectRepository.findByCreatorId(creatorId);

    }
    @Override
    public Project saveProject(Project project) {
        project.setCurrentAmount(0.0);
        return projectRepository.save(project);
    }
    @Override
    public Project updateProject(Long id, Project updatedProject) {

        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found with id: " + id)
                );

        existingProject.setTitle(updatedProject.getTitle());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setCategory(updatedProject.getCategory());
        existingProject.setGoalAmount(updatedProject.getGoalAmount());
        existingProject.setDeadline(updatedProject.getDeadline());
        return projectRepository.save(existingProject);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found: " + id)
                );

        contributionRepository.deleteByProjectId(id);

        projectRepository.delete(project);
    }

    @Autowired
    private ContributionRepository contributionRepository;

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

}
