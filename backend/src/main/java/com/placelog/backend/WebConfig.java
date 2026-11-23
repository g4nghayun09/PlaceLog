package com.placelog.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

// spring 설정 클래스라고 지칭함
@Configuration
// spring mvc의 설정을 직접 추가하거나 변경을 할수있게 해줌.
public class WebConfig implements WebMvcConfigurer {

    // cors란 : 서로 다른 출처에서 실행되는 웹 간의 http 요청을 허용할지 결정하는 브라우저 보안 정책

    // cors 설정
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // api 아래의 모든 경로를 가지고
        registry.addMapping("/api/**")
                // 어디에서 오는 요청을 허용할지 정하고
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                // 허용할 메서드를 지정하고
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // 쿠키나 세션 정보같은 것을 포함한 요청을 유지하겠다?
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // uploads 아래의 모든 경로를 가지고
        registry.addResourceHandler("/uploads/**")
                // 이미지 파일이 실제로 저장되는 컴 폴더 위치를 지정
                .addResourceLocations(com.placelog.backend.image.ImageController.UPLOAD_DIR.toUri().toString());
    }
}