package VirusDecode.backend.controller;


import VirusDecode.backend.dto.SequenceRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/inputSeq")
public class inputSeqController {

    
    @PostMapping("/reference")
    public ResponseEntity<String> processDone(@RequestBody SequenceRequest request) {
        String sequenceId = request.getSequenceId();
        // 여기서 sequenceId를 사용하여 필요한 처리를 수행합니다.
        System.out.println("Processing DONE for sequence ID: " + sequenceId);

        Map<String, Object> metadata = new HashMap<>();
        metadata = referenceIdPy(sequenceId);

        return ResponseEntity.ok("DONE processing completed for sequence ID: " + metadata);
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyze(@RequestParam("sequenceId") String sequenceId,
                                                       @RequestParam(value = "files", required = false) MultipartFile[] files,
                                                       @RequestParam(value = "sequences", required = false) String[] sequences) {
        // 파일, 시퀀스 처리 로직 필요

        // JSON 응답 생성
        Map<String, Object> response = new HashMap<>();
        response.put("sequenceId", sequenceId);
        response.put("message", "Files processed successfully");

        // 실제 응답 데이터 로직
        // response.put("data", ...);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    // reference id --> metadata ( MAP )
    public static Map<String, Object> referenceIdPy(String referenceId) {
        Map<String, Object> metadata = new HashMap<>();
        try {
            // 파이썬 스크립트 경로를 ClassPathResource를 사용하여 얻기
            ClassPathResource resource = new ClassPathResource("bioinformatics/test.py");
            String scriptPath = resource.getFile().getAbsolutePath();

            // 파이썬 스크립트와 인자를 설정
            String[] command = new String[]{"python3", scriptPath, referenceId};

            // ProcessBuilder를 사용하여 프로세스를 시작
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // 프로세스의 출력을 읽기 위한 BufferedReader
            BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                output.append(line);
            }
            in.close();

            // JSON 문자열을 Map 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            metadata = objectMapper.readValue(output.toString(), HashMap.class);

            // 프로세스가 완료될 때까지 대기
            process.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return metadata;
    }


}


