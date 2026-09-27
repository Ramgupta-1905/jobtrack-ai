package com.jobtrackai.jobtrack_backend.repository;

import com.jobtrackai.jobtrack_backend.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}