package Backend.service.impl;
import Backend.entity.Project;
import Backend.repository.ProjectRepository;
import Backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
