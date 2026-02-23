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
load-test.js
`
# Explicacion resultados:
❓ ¿Qué indica el 44% de error?

Respuesta:

Indica que el sistema alcanzó su límite de capacidad y comenzó a rechazar o fallar solicitudes, posiblemente por saturación de CPU, conexiones o base de datos, tambien se puede apreciar que a los 3600 vu, el sistema se empieza a degradar. (cada **vu** ejecuta el script de manera independiente)
