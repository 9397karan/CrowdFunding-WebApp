package Backend.service;

import Backend.entity.User;

import java.util.List;

public interface UserService {

    User registerUser(User user);

    List<User> getAllUsers();
    User login(String email, String password);
    User getUserById(Long id);
}
