package com.dev101.coa.global.security.controller;

import com.dev101.coa.global.security.service.AuthenticationService;
import com.dev101.coa.global.security.service.CustomOAuth2UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final CustomOAuth2UserService customOAuth2UserService;


//    @PostMapping("/oauth")
//    public ResponseEntity<?> authenticateUser(@AuthenticationPrincipal OAuth2User principal) {
//
//        String jwt = authenticationService.authenticateOAuth2(principal);
////        // JWT 토큰을 쿠키에 담음 // , HttpServletResponse response
////        Cookie authCookie = new Cookie("jwt", jwt);
////        authCookie.setHttpOnly(true);
////        authCookie.setSecure(true);
////        authCookie.setPath("/");
////        response.addCookie(authCookie);
//
////        return ResponseEntity.ok().build();
//        return ResponseEntity.ok().body(new AuthResponse(jwt));
//    }


    @Getter
    public static class AuthResponse {
        private String authToken;

        public AuthResponse(String authToken) {
            this.authToken = authToken;
        }

        public void setAuthToken(String authToken) {
            this.authToken = authToken;
        }
    }
}