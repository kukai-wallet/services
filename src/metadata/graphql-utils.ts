export function makaGraphQLQuery(contract: string, tokenIds: string[]) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
            query FetchListings {
                token(
                  where: {fa_contract: {_eq: "${contract}"}, token_id: {_in: [${tokenIds.map(o => `"${o}"`)}]}}
                ) {
                  artifact_uri
                }
              }              
        ` })
  }
}