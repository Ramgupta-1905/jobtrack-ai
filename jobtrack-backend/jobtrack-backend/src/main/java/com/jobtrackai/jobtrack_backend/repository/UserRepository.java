package com.jobtrackai.jobtrack_backend.repository;
import java.util.Optional;
import com.jobtrackai.jobtrack_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}