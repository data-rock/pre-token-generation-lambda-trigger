import { getCompany } from './imageMetadataApi';

export const preTokenGeneration = async (event, context, callback) => {
  console.log('event :', event);
  const isAdmin = !!event.request.userAttributes['custom:isAdmin'];
  console.log('isAdmin :', isAdmin);
  const companyId = event.request.userAttributes['custom:companyId'];
  console.log('companyId :', companyId);

  const mfaRequired = isAdmin || companyId ? (await getCompany(companyId)).mfaRequired : false;
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
