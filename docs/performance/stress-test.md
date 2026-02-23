# Para ejecutarlo y ver metricas en dashboard:
`
BASE_URL=https://192.168.122.17 \
TOKEN_URL=https://192.168.122.17/realms/toolrent/protocol/openid-connect/token \
CLIENT_ID=toolrent-frontend \
USERNAME=user_test_staging \
PASSWORD=123 \
K6_WEB_DASHBOARD=true \
k6 run \
--insecure-skip-tls-verify \
stress-test.js
`
# Explicacion resultados:
Bajo esta configuración, el sistema muestra un comportamiento no lineal, donde el incremento en carga provoca colapso abrupto en lugar de degradación progresiva. La tasa de error del 75% indica que el sistema superó ampliamente su capacidad máxima operativa.
 como solucionarlo?


- Escalamiento horizontal (load balancer)

- Implementar caching

- Optimizar queries
