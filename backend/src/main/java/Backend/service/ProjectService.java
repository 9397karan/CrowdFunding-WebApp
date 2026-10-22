package Backend.service;

import Backend.entity.Project;
import java.util.List;

public interface ProjectService {

    Project saveProject(Project project);

    List<Project> getProjectsByCreator(Long creatorId);

    List<Project> getAllProjects();

    Project getProjectById(Long id);

    Project updateProject(Long id, Project project);

    void deleteProject(Long id);
}