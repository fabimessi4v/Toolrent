# Para ejecutarlo:
`
BASE_URL=https://192.168.122.17 \
TOKEN_URL=https://192.168.122.17/realms/toolrent/protocol/openid-connect/token \
CLIENT_ID=toolrent-frontend \
USERNAME=user_test_staging \
PASSWORD=123 \
k6 run load-test.js
`