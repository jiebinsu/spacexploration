import { transformResponse } from '@/services/spacex/util';

describe('Util - transformResponse', () => {
  it('should transform SpaceXRocketsResponse to id name key value map', () => {
    const response: SpaceXRocketsResponse = {
      docs: [
        { id: '1', name: 'rocket1' },
        { id: '2', name: 'rocket2' },
      ],
      totalDocs: 2,
      pages: 1,
      totalPages: 1,
      page: 1,
      prevPage: null,
      nextPage: null,
      hasPrevPage: false,
      hasNextPage: false,
    };
    const expected = {
      '1': 'rocket1',
      '2': 'rocket2',
    };

    expect(transformResponse(response)).toEqual(expected);
  });

  it('should transform SpaceXLaunchPadsResponse to id name key value map', () => {
    const response: SpaceXLaunchPadsResponse = {
      docs: [
        { id: '1', name: 'lp1' },
        { id: '2', name: 'lp2' },
        { id: '3', name: 'lp3' },
        { id: '4', name: 'lp4' },
      ],
      totalDocs: 2,
      pages: 1,
      totalPages: 1,
      page: 1,
      prevPage: null,
      nextPage: null,
      hasPrevPage: false,
      hasNextPage: false,
    };
    const expected = {
      '1': 'lp1',
      '2': 'lp2',
      '3': 'lp3',
      '4': 'lp4',
    };

    expect(transformResponse(response)).toEqual(expected);
  });

  it('should return empty map if no items (docs) in response', () => {
    const response: SpaceXLaunchPadsResponse = {
      docs: [],
      totalDocs: 0,
      pages: 1,
      totalPages: 1,
      page: 1,
      prevPage: null,
      nextPage: null,
      hasPrevPage: false,
      hasNextPage: false,
    };

    expect(transformResponse(response)).toEqual({});
  });
});
