package com.emilia.backend.service.fileStorage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IFileStorageService {
    void save(MultipartFile file, String path) throws IOException;
    void delete(String filePath) throws IOException;
    void move(String oldPath, String newPath) throws IOException;
    boolean exists(String path);
    void saveOrReplace(MultipartFile file, String path) throws IOException;
}
