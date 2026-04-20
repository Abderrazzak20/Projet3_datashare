package com.datashare.backend.scheduling;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.datashare.backend.service.FileService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class StartupCleanupRunner implements ApplicationRunner {

    private final FileService fileService;

    @Override
    public void run(ApplicationArguments args) {
        try {
            fileService.deleteExpiredFiles();
            log.info("supressione fichiere complete sans probleme ");
        } catch (Exception e) {
        log.error("erreur dans la supression de fichier", e);
        }
    }

}