const SAMPLE_YAML = `apiVersion: v1
kind: Secret
metadata:
  name: techwebcode-db-secret
  namespace: default
type: Opaque
data:
  DB_HOST: bG9jYWxob3N0
  DB_USER: cm9vdA==
  DB_PASSWORD: dGVjaHdlYmNvZGUxMjM=
  API_KEY: c2VjcmV0LWFwaS1rZXktMjAyNg==
`;

export default SAMPLE_YAML;
