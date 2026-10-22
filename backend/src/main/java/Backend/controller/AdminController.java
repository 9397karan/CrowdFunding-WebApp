
package Backend.controller;

import Backend.repository.UserRepository;
import Backend.repository.ProjectRepository;
import Backend.repository.ContributionRepository;
import Backend.entity.User;
import Backend.entity.Project;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    private final UserRepository users;
    private final ProjectRepository projects;
    private final ContributionRepository contributions;

    public AdminController(
            UserRepository users,
            ProjectRepository projects,
            ContributionRepository contributions) {
        this.users = users;
        this.projects = projects;
        this.contributions = contributions;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.count());
        stats.put("totalProjects", projects.count());
        stats.put("totalContributions", contributions.count());
        stats.put("totalRaised", contributions.findAll().stream()
                .mapToDouble(c -> c.getAmount())
                .sum());
        return stats;
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return users.findAll();
    }

    @GetMapping("/projects")
    public List<Project> getProjects() {
        return projects.findAll();
    }
}
