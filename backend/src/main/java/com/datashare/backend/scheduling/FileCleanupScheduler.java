package com.datashare.backend.scheduling;

import java.io.IOException;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.datashare.backend.service.FileService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class FileCleanupScheduler {
	
	private final FileService fileService;
	@Scheduled(cron = "0 0 2 * * *")
	public void cleanupExpiredFiles() {
        try {
            fileService.deleteExpiredFiles();
            log.info("supressione fichiere complete sans probleme ");
        } catch (Exception e) {
            log.error("erreur dans la supression de fichier", e);
        }
    }

}
