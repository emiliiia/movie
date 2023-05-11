package com.emilia.backend.controller;
/*
  @author emilia
  @project movie
  @class ImageController
  @version 1.0.0
  @since 02.05.2023 - 18:49
*/

import com.emilia.backend.service.fileStorage.FilesStorageServiceImpl;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping(value = "/api/image", produces = MediaType.APPLICATION_JSON_VALUE)
public class ImageController {
    private final FilesStorageServiceImpl fileService;

    public ImageController(FilesStorageServiceImpl fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/uploadPhoto/")
    public void upload(@RequestPart MultipartFile photo, @RequestParam String newPath) throws IOException {
        fileService.save(photo, newPath);
    }
}
