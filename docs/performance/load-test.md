# Para ejecutarlo:
`
BASE_URL=https://192.168.122.17 \
TOKEN_URL=https://192.168.122.17/realms/toolrent/protocol/openid-connect/token \
CLIENT_ID=toolrent-frontend \
USERNAME=user_test_staging \
PASSWORD=123 \
<<<<<<< Updated upstream
k6 run --insecure-skip-tls-verify  load-test.js --out json=resultado_load_test.json
`
=======
k6 run load-test.js
`
>>>>>>> Stashed changes
