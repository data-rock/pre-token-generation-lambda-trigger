import fetch from 'node-fetch';
import config from './config';

export const getCompany = async (id) => {
  const fetchOptions = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `digest ${config.metadataApi.key}`,
    },
  };
  const response = await fetch(`${config.metadataApi.companyUrl}/${id}`, fetchOptions);

  if (!response.ok) throw new Error(`Failed to retrieve company info for id: ${id}`);

  return response.json();
};
