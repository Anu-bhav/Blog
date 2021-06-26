const ghpages = require("gh-pages");
const pathname = `${__dirname}/__sapper__/export/Logbook`;
const repoURL = "https://github.com/Anu-bhav/Logbook";

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
