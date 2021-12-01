const ghpages = require("gh-pages");
const pathname = `${__dirname}/__sapper__/export/logbook`;

ghpages.publish(
  pathname,
  {
    branch: "gh-pages",
    repo: "https://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@github.com/Anu-bhav/logbook",
  },
  (err) => {
    if (err) console.log("ERROR: ", err);
    else console.log("PUBLISHED");
  }
);
