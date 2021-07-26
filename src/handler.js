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
  console.log('event :', event);
  const isAdmin = event.request.userAttributes['custom:isAdmin'];
  console.log('isAdmin :', isAdmin);
  const companyId = event.request.userAttributes['custom:companyId'];
  console.log('companyId :', companyId);

  const mfaRequired = await isMfaRequired(isAdmin, companyId);
  console.log('mfaRequired :', mfaRequired);

  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        mfaRequired,
      },
    },
  };

  // Return to Amazon Cognito
  callback(null, event);
};
