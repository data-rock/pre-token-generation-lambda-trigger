'use strict';

module.exports.preTokenGeneration = (event, context, callback) => {
  event.response = {
      "claimsOverrideDetails": {
          "claimsToAddOrOverride": {
              "attribute_key2": "attribute_value2",
              "attribute_key": "attribute_value"
          },
          "claimsToSuppress": ["email"]
      }
  };

  // Return to Amazon Cognito
  callback(null, event);
};
