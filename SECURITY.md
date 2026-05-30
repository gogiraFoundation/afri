# Security Policy

## Supported versions

| Component | Supported |
| --------- | --------- |
| `main` branch (production) | Yes |
| Older unmaintained branches | No |

## Reporting a vulnerability

If you believe you have found a security issue in the Afri Cleans website or API, please report it privately:

- **Email:** security@africleans.com (replace with your operational inbox before launch)
- **Do not** open a public GitHub issue for exploitable vulnerabilities.

We aim to acknowledge reports within **72 hours** and will share an expected timeline for remediation when we confirm the issue.

Please include: affected URL or endpoint, steps to reproduce, impact assessment, and any proof-of-concept that is safe to share.

## What to expect

- We will investigate and, if valid, prioritize a fix based on severity.
- We may ask for additional information.
- We will notify you when a fix is deployed (where appropriate).
- We do not currently offer a paid bug bounty program.

## Secure development

Pre-deploy checks: `./scripts/security_checklist` (see [SECURITY_CHECKS.md](SECURITY_CHECKS.md)).
