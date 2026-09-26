package com.jobtrackai.jobtrack_backend.repository;

import com.jobtrackai.jobtrack_backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByUserIdOrderByAppliedDateDesc(Long userId);

    Optional<Application> findByIdAndUserId(
            Long applicationId,
            Long userId
    );

    boolean existsByCompanyIgnoreCaseAndRoleIgnoreCaseAndUserId(
            String company,
            String role,
            Long userId
    );
}