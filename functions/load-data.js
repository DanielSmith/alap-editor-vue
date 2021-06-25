// load-data.js

exports.handler = async (event, context) => {
  console.log(event.body);
  const allBody = JSON.parse(event.body);
  const { sitelink } = JSON.parse(event.body);

  console.log("load  data.... " + allBody);
};
