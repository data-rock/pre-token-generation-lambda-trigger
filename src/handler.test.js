import { preTokenGeneration } from './handler';
import { getUser } from './cognito';
import { getCompany } from './imageMetadataApi';

jest.mock('./cognito');
jest.mock('./imageMetadataApi');

const getClaimsToAddOrOverride = (mockCallback) =>
  mockCallback.mock.calls[0][1].response.claimsOverrideDetails.claimsToAddOrOverride;
const getMfaRequired = (mockCallback) => getClaimsToAddOrOverride(mockCallback).mfaRequired;
const getMfaEnabled = (mockCallback) => getClaimsToAddOrOverride(mockCallback).mfaEnabled;

describe('handler', () => {
  const mockContext = {};
  const mockCallback = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('admin user', () => {
    beforeEach(() => {
      getUser.mockResolvedValue({});
    });

    it('sets `mfa_required` to true', async () => {
      const event = {
        request: {
          userAttributes: {
            'custom:isAdmin': true,
          },
        },
      };
      await preTokenGeneration(event, mockContext, mockCallback);
      expect(getMfaRequired(mockCallback)).toBe(true);
    });
  });

  describe("user's company requires MFA to be enabled", () => {
    beforeEach(() => {
      getCompany.mockResolvedValue({ mfaRequired: true });
      getUser.mockResolvedValue({});
    });

    it('sets `mfa_required` to true', async () => {
      const event = {
        request: {
          userAttributes: {
            'custom:companyId': 1,
          },
        },
      };
      await preTokenGeneration(event, mockContext, mockCallback);
      expect(getMfaRequired(mockCallback)).toBe(true);
    });
  });

  describe("user's company does not require MFA to be enabled", () => {
    beforeEach(() => {
      getCompany.mockResolvedValue({ mfaRequired: false });
      getUser.mockResolvedValue({});
    });

    it('sets `mfa_required` to false', async () => {
      const event = {
        request: {
          userAttributes: {
            'custom:companyId': 1,
          },
        },
      };
      await preTokenGeneration(event, mockContext, mockCallback);
      expect(getMfaRequired(mockCallback)).toBe(false);
    });
  });

  describe('MFA has been enabled', () => {
    beforeEach(() => {
      getCompany.mockResolvedValue({ mfaRequired: true });
      getUser.mockResolvedValue({ PreferredMfaSetting: 'SOFTWARE_TOKEN_MFA' });
    });

    it('sets `mfa_enabled` to true', async () => {
      const event = {
        request: {
          userAttributes: {
            'custom:companyId': 1,
          },
        },
      };
      await preTokenGeneration(event, mockContext, mockCallback);
      expect(getMfaEnabled(mockCallback)).toBe(true);
    });
  });

  describe('MFA has *not* been enabled', () => {
    beforeEach(() => {
      getCompany.mockResolvedValue({ mfaRequired: true });
      getUser.mockResolvedValue({});
    });

    it('sets `mfa_enabled` to false', async () => {
      const event = {
        request: {
          userAttributes: {
            'custom:companyId': 1,
          },
        },
      };
      await preTokenGeneration(event, mockContext, mockCallback);
      expect(getMfaEnabled(mockCallback)).toBe(false);
    });
  });

  describe('MFA is not required', () => {
    beforeEach(() => {
      getCompany.mockResolvedValue({ mfaRequired: false });
    });

    it('sets `mfa_enabled` to false', async () => {
      const event = {
        request: {
          userAttributes: {
            'custom:companyId': 1,
          },
        },
      };
      await preTokenGeneration(event, mockContext, mockCallback);
      expect(getMfaEnabled(mockCallback)).toBe(false);
    });
  });
});
