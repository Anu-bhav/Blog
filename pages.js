const ghpages = require("gh-pages");
const dotenv = require('dotenv');
dotenv.config();
const pathname = `${__dirname}/__sapper__/export/logbook`;
const repoURL = `https://${process.env.GH_TOKEN}@github.com/Anu-bhav/logbook`;

ghpages.publish(
  pathname,
  {
    branch: "gh-pages",
    repo: repoURL,
  },
  (err) => {
    if (err) console.log("ERROR: ", err);
    else console.log("PUBLISHED");
  }
);
