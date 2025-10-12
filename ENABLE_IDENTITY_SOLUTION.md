# Solution: Enable Admin Access for Directus CMS

You're being asked for a username and password because the Directus admin access hasn't been configured yet. Follow these steps to resolve this issue:

## Step 1: Access Your Directus Instance

1. Go to your Directus admin URL (typically http://localhost:8055/admin)
2. Make sure you're accessing the correct URL for your deployment

## Step 2: Use Default Admin Credentials

For local development, use the default credentials:
- Email: admin@example.com
- Password: d1r3ctu5

For production deployments, you should have set up your own admin credentials during the Directus setup process.

## Step 3: Configure Admin Users

1. After logging in as the initial admin:
   - Go to the "Users" section in Directus
   - Create additional admin users as needed
   - Assign appropriate roles and permissions

## Step 4: Access Your CMS

After completing the above steps:

1. Navigate to your Directus admin URL
2. Log in with your admin credentials
3. Start managing your content through the Directus interface

## Troubleshooting

### If You Can't Log In

1. Make sure you're using the correct Directus admin URL
2. Verify your credentials are correct
3. If using default credentials, ensure Directus is properly configured
4. Check that the Directus service is running

### If You Forgot Your Password

1. Use the "Forgot Password" feature on the login page
2. If that doesn't work, you may need to reset the admin password through the database
3. For local development, you can reset to default credentials by clearing the Directus database

### Database Connection Issues

1. Verify that your database connection settings are correct
2. Check that the database service is running
3. Ensure proper network connectivity to the database

## Need Help?

If you're still having issues:

1. Check the [Directus Documentation](https://docs.directus.io/)
2. Review the project setup documentation
3. Check the Directus logs for error messages