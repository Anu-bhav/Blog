const ghpages = require("gh-pages");
const pathname = `${__dirname}/__sapper__/export`;
const repoURL = "https://github.com/Anu-bhav/Portfolio-Blog";

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
