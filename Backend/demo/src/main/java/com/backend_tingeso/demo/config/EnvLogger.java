package com.backend_tingeso.demo.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class EnvLogger implements ApplicationRunner {
    private final Environment env;
    private final Logger log = LoggerFactory.getLogger(EnvLogger.class);

    public EnvLogger(Environment env) {
        this.env = env;
    }

    @Override
    public void run(ApplicationArguments args) {
        String[] keys = new String[] {
            "SPRING_APPLICATION_NAME",
            "DB_URL",
            "DB_USER",
            "DB_PASSWORD",
            "DB_DRIVER",
            "SERVER_PORT",
            "LOG_LEVEL",
            "KEYCLOAK_REALM"
        };

        log.info("--- EnvLogger: comprobando variables de entorno ---");
        for (String k : keys) {
            String prop = env.getProperty(k);
            String sys = System.getenv(k);
            log.info("{} (Environment) = {}", k, prop != null ? prop : "n/a");
            log.info("{} (System.getenv) = {}", k, sys != null ? sys : "n/a");
        }
        log.info("--- EnvLogger: fin ---");
    }
}

