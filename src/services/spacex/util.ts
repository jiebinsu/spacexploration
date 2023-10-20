export const transformResponse = (response: SpaceXRocketsResponse | SpaceXLaunchPadsResponse) => {
  return response.docs.reduce((acc: Record<string, string>, curr) => {
    acc[curr.id] = curr.name;
    return acc;
  }, {});
};
