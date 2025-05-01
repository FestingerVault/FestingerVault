import { config } from "dotenv";
import fs from "fs-extra";
import { sync } from "glob";
import path, { format } from "path";
import po2json from "po2json";
config();
const patterns = ["languages/**/*.po"];
const files = sync(patterns, { nocase: true, nodir: true });
const languages=[];
files.forEach(file => {
  const jsonData = po2json.parseFileSync(file, {
    fuzzy: false,
    format: "jed1.x",
    domain: process.env.TEXTDOMAIN,
    "fallback-to-msgid": false,
  });
	const filename=
  fs.writeFileSync(
    path.join(
      "languages",
      `${path.parse(file).name}-${process.env.SLUG}-script.json`,
    ),
    JSON.stringify(jsonData),
  );
  // fs.writeFileSync(
  //   path.join(
  //     "languages",
  //     `${jsonData.locale_data[process.env.TEXTDOMAIN][""].lang.replace("_","-")}.json`,
  //   ),
  //   JSON.stringify(jsonData),
  // );
	languages.push(jsonData.locale_data[process.env.TEXTDOMAIN][""].lang.replace("_","-"));

});
fs.writeFileSync(
	path.join(
		"languages",
		`available-languages.json`,
	),
	JSON.stringify(languages),
);
