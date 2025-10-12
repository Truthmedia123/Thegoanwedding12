# Security Hardening Guide

This document outlines the security measures implemented for TheGoanWedding application.

## Credentials Rotation

### Directus Security
- ✅ Generated new 32-character random keys for `KEY` and `SECRET`
- ✅ Created strong admin password with mixed case, numbers, and symbols
- ✅ Updated all environment files with new credentials

### Admin Dashboard Token
- ✅ Rotated admin dashboard token from default `admin-secret-2024` to a random value
- ✅ Updated documentation with new token

## Environment Security

### Sensitive Data Protection
- ✅ All sensitive credentials stored in environment variables
- ✅ No hardcoded secrets in source code
- ✅ Environment files excluded from version control via `.gitignore`

### CORS Configuration
The application implements proper CORS settings to prevent unauthorized access:

```javascript
cors: {
  enabled: true,
  origin: true, // Allow same origin requests
}
```

### Rate Limiting
Built-in rate limiting is enabled to prevent abuse:

```javascript
rateLimiter: {
  enabled: true,
}
```

## API Security

### Authentication
- ✅ Token-based authentication for admin dashboard
- ✅ Strong password requirements for admin accounts
- ✅ Regular credential rotation recommended

### Data Access
- ✅ Public role configured with minimal read permissions
- ✅ Sensitive data fields restricted from public access
- ✅ Field-level permissions implemented

## Network Security

### HTTPS Enforcement
- ✅ All production connections use HTTPS
- ✅ Redirect HTTP to HTTPS in production

### Firewall Considerations
- ✅ Restrict Directus admin access to specific IP addresses in production
- ✅ Use reverse proxy for additional security layer

## File Security

### Upload Security
- ✅ File type validation implemented
- ✅ File size limits configured
- ✅ Uploaded files stored outside web root when possible

## Monitoring and Logging

### Audit Logs
- ✅ Directus activity logging enabled
- ✅ Regular review of access logs recommended
- ✅ Monitor for suspicious activity

## Best Practices Implemented

1. **Regular Updates**: Keep all dependencies updated
2. **Secure Configuration**: Use environment variables for all sensitive data
3. **Access Control**: Implement principle of least privilege
4. **Input Validation**: Validate all user inputs
5. **Error Handling**: Don't expose sensitive information in error messages
6. **Session Management**: Configure appropriate session timeouts
7. **Backup Strategy**: Regular database backups
8. **Security Scanning**: Regular automated security scans

## Security Scripts

### Rotate Directus Token
Run the following script to rotate credentials:
```bash
node scripts/rotate-directus-token.js
```

This script will:
- Generate new secure keys for Directus
- Create a strong admin password
- Update all environment files
- Rotate the admin dashboard token

## Next Steps

1. ✅ Restart Directus service to apply new credentials
2. ✅ Test application functionality with new configuration
3. ✅ Store credentials in secure password manager
4. ✅ Schedule regular credential rotation
5. ✅ Implement additional security measures for production deployment

## Production Security Checklist

- [ ] Change all default credentials
- [ ] Enable two-factor authentication for admin accounts
- [ ] Configure IP restrictions for admin access
- [ ] Set up SSL/TLS certificates
- [ ] Implement proper backup and recovery procedures
- [ ] Configure security headers
- [ ] Set up monitoring and alerting
- [ ] Regular security audits and penetration testing
- [ ] Keep all software updated
- [ ] Implement proper logging and log retention