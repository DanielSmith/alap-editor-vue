exports.handler = async (event, context) => {
  const meta = require("meta-grabber");

  console.log(event.body);
  const allBody = JSON.parse(event.body);
  const { sitelink } = JSON.parse(event.body);

  console.log("all bod " + allBody);
  console.log("sitelink " + sitelink);

  try {
    const res = meta(sitelink);
    console.dir(res);
    return {
      statusCode: 200,
      body: JSON.stringify({ res: res }),
    };
  } catch (error) {
    console.dir(error);
  }
};
