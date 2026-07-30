package Backend.controller;

import Backend.entity.Contribution;
import Backend.service.ContributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contributions")
@CrossOrigin("*")
public class ContributionController {

    @Autowired
    private ContributionService contributionService;

    @PostMapping
    public Contribution contribute(@RequestBody Contribution contribution) {

        return contributionService.contribute(contribution);

    }
    @GetMapping("/project/{projectId}")
    public List<Contribution> getProjectContributions(
            @PathVariable Long projectId
    ){

        return contributionService.getContributions(projectId);

    }
    @GetMapping("/user/{userId}")
    public List<Contribution> getUserContributions(
            @PathVariable Long userId
    ){

        return contributionService.getUserContributions(userId);

    }
}
