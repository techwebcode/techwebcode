import { ProjectFile, Finding } from "../types";

/**
 * Analyzes Nginx configuration directives and cross-checks proxy upstreams against Docker Compose & K8s.
 */
export function runNginxAnalyzer(files: ProjectFile[]): Finding[] {
  const findings: Finding[] = [];
  const nginxFiles = files.filter((f) => f.type === "nginx");

  if (nginxFiles.length === 0) return findings;

  const composeFiles = files.filter((f) => f.type === "docker-compose");

  nginxFiles.forEach((file) => {
    let hasSsl = false;
    let hasGzip = false;

    file.lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      if (trimmed.includes("ssl_certificate")) hasSsl = true;
      if (trimmed.includes("gzip on")) hasGzip = true;

      // 1. Inspect proxy_pass directives
      if (trimmed.includes("proxy_pass ")) {
        const targetUrl = trimmed.split("proxy_pass ")[1].replace(";", "").trim();

        // Check if proxy_pass targets localhost instead of Docker service name
        if (targetUrl.includes("localhost") || targetUrl.includes("127.0.0.1")) {
          if (composeFiles.length > 0) {
            findings.push({
              id: `NGINX-PROXY-LOCALHOST-${file.path}-${idx}`,
              ruleId: "NGX-001",
              severity: "error",
              title: "Nginx Proxies to 'localhost' inside Docker Network",
              explanation: `Nginx directive 'proxy_pass ${targetUrl}' uses 'localhost'. Inside Docker Compose networks, Nginx cannot connect to app containers via host localhost.`,
              affectedFile: file.path,
              lineNumber: idx + 1,
              relatedFiles: composeFiles.map((c) => c.path),
              recommendedFix: `Change 'proxy_pass ${targetUrl}' to use the Docker Compose container service name (e.g. 'proxy_pass http://backend:8080').`,
            });
          }
        }

        // Cross-check port in proxy_pass vs Compose exposed ports
        const portMatch = targetUrl.match(/:(\d+)/);
        if (portMatch && composeFiles.length > 0) {
          const proxyPort = parseInt(portMatch[1], 10);
          const portFoundInCompose = composeFiles.some((c) => c.content.includes(`:${proxyPort}`) || c.content.includes(`${proxyPort}:`));

          if (!portFoundInCompose) {
            findings.push({
              id: `NGINX-PROXY-PORT-MISMATCH-${file.path}-${proxyPort}`,
              ruleId: "NGX-002",
              severity: "warning",
              title: `Nginx Target Port ${proxyPort} Not Exposed in Docker Compose`,
              explanation: `Nginx proxies traffic to port ${proxyPort} (${targetUrl}), but no Docker Compose service exposes or maps port ${proxyPort}.`,
              affectedFile: file.path,
              lineNumber: idx + 1,
              recommendedFix: `Ensure Docker Compose service target port matches ${proxyPort}.`,
            });
          }
        }
      }
    });

    // 2. SSL / HTTPS Notice
    if (!hasSsl) {
      findings.push({
        id: `NGINX-NO-SSL-${file.path}`,
        ruleId: "NGX-003",
        severity: "warning",
        title: "Nginx SSL / HTTPS Directives Missing",
        explanation: `Nginx configuration in ${file.name} does not specify ssl_certificate directives. Production web traffic should be encrypted via HTTPS.`,
        affectedFile: file.path,
        recommendedFix: "Add SSL server block and certbot certificates ('listen 443 ssl; ssl_certificate /etc/letsencrypt/live/...').",
      });
    }

    // 3. Performance Notice
    if (!hasGzip) {
      findings.push({
        id: `NGINX-NO-GZIP-${file.path}`,
        ruleId: "NGX-004",
        severity: "info",
        title: "Nginx Gzip Compression Disabled",
        explanation: `Gzip compression is not enabled in ${file.name}. Enabling gzip reduces asset bandwidth and speeds up page load times.`,
        affectedFile: file.path,
        recommendedFix: "Add 'gzip on; gzip_types text/plain text/css application/json application/javascript;' to your Nginx http block.",
      });
    }
  });

  return findings;
}
