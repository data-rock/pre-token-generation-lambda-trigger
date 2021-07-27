import { getUser } from './cognito';
import { getCompany } from './imageMetadataApi';

const isMfaRequired = async (isAdmin, companyId) => {
  if (isAdmin) return true;
  if (companyId) {
    const company = await getCompany(companyId);
    return company.mfaRequired;
  }
  return false;
};

export const preTokenGeneration = async (event, context, callback) => {
  const isAdmin = event.request.userAttributes['custom:isAdmin'];
  const companyId = event.request.userAttributes['custom:companyId'];
  const mfaRequired = await isMfaRequired(isAdmin, companyId);

  let mfaEnabled = false;
  if (mfaRequired) {
    const user = await getUser(event.userName);
    mfaEnabled = user.PreferredMfaSetting === 'SOFTWARE_TOKEN_MFA';
  }

  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        mfaRequired,
        mfaEnabled,
      },
    },
  };

  // Return to Amazon Cognito
  callback(null, event);
};
