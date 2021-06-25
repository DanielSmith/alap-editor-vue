const GET_LINKS = `
# Write your query or mutation here
query{
  allLinks{
    data {
      name
      _id
      url
      description
      archived
    }
  }
}`;

const CREATE_LINK = `
    mutation($name: String!, $jsondata: String! ) {
        createAlapConfig( data: { name:$name, jsondata:$jsondata }) {
          name
          jsondata
        }
    }
`;

const UPDATE_LINK = `
  mutation($id: ID!, $archived: Boolean!, $name: String!, $url: String!, $description: String!  ) {
    updateAlapConfig( id: $id, data: { name:$name, url: $url, description: $description, archived: $archived }) {
            name
            _id
            url
            description
            archived
        }
    }
`;

const DELETE_LINK = `
  mutation($id: ID!) {
        deleteLink( id: $id) {
            _id
        }
    }
`;

module.exports = {
  GET_LINKS,
  CREATE_LINK,
  UPDATE_LINK,
  DELETE_LINK,
};
