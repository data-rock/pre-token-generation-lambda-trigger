import { getCompany } from './imageMetadataApi';

export const preTokenGeneration = async (event, context, callback) => {
  const isAdmin = event.request.userAttributes['custom:isAdmin'];
  console.log('isAdmin :', isAdmin);
  const companyId = event.request.userAttributes['custom:companyId'];
  console.log(' :');

  const mfaRequired = isAdmin || getCompany(companyId).mfaRequired;
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
