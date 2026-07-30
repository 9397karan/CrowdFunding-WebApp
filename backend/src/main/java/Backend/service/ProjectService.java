package Backend.service;

import Backend.entity.Project;

import java.util.List;

public interface ProjectService {

    Project saveProject(Project project);
    List<Project> getProjectsByCreator(Long creatorId);
    List<Project> getAllProjects();

    Project getProjectById(Long id);

    void deleteProject(Long id);
}