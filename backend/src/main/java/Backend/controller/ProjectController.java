
package Backend.controller;

import Backend.entity.Project;
import Backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // Create a new project
    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.saveProject(project);
    }

    // Get all projects
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // Get project by ID
    @GetMapping("/{id}")
    public Project getProject(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    // Update an existing project
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project project
    ) {
        return projectService.updateProject(id, project);
    }

    // Delete a project and its associated contributions
    @DeleteMapping("/{id}")
    public String deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return "Project Deleted Successfully";
    }

    // Get projects created by a particular creator
    @GetMapping("/creator/{creatorId}")
    public List<Project> getCreatorProjects(
            @PathVariable Long creatorId
    ) {
        return projectService.getProjectsByCreator(creatorId);
    }
}
