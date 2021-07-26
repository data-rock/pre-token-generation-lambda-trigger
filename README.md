# Pre Token Generation Lambda Trigger

Adds additional claims to the Cognito before the auth token is generated for users accessing Datarock-ui. The use case for this is to claims that indicate whether the user's company requires multifactor authentication (MFA) and whether or not the user has MFA enabled.

## Local Development

### Install dependencies

```
npm install
```
