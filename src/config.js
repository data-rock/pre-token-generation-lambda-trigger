const requireEnvVariable = (variableName) => {
  const value = process.env[variableName];
  if (value === null || value === undefined) {
    throw new Error(`Environment variable '${variableName}' not set`);
  }
  return value;
};

export default {
  metadataApi: {
    companyUrl: `${requireEnvVariable('METADATA_API_URL')}/company`,
    key: requireEnvVariable('METADATA_API_KEY'),
  },
};
