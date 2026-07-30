package Backend.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String category;

    private Double goalAmount;

    private Double currentAmount;

    private LocalDate deadline;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;
}