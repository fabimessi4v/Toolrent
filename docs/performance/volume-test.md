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
volume-test.js
`
# Explicacion resultados:
Se observó un incremento exponencial en data_received al aumentar el volumen de registros, evidenciando que el endpoint carece de paginación y devuelve el dataset completo, afectando la escalabilidad de red y consumo de memoria.
---
- 1k filas -> 2 gb
- 50k filas -> 24 gb
- 200k filas -> punto de fallo