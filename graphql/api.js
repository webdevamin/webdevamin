import client from "./client";
import { GET_GLOBAL } from "./queries";

const getData = async (queryName, params, includeGlobalData = true) => {
  const { data } = await client.query({
    query: queryName,
    variables: params,
  });

  if (includeGlobalData) {
    const { data: globalData } = await client.query({
      query: GET_GLOBAL,
      variables: params,
    });

    return { data, globalData };
  }

  return data;
};

export { getData };
