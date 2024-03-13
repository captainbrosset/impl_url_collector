import bcd from './bcd/build/data.json' assert { type: 'json' };

// Keeping it simple and not too huge for now.
const IGNORE_BROWSERS = ['ie', 'deno', 'nodejs', 'oculus', 'webview_android',
  'chrome_android', 'firefox_android', 'opera_android', 'opera',
  'safari_ios', 'samsunginternet_android'];

// Just web browser stuff.
const IGNORE_BCD_PREFIXES = ['webextensions', 'webdriver']

let lastCompatData = null;

function walkBCD(data, path = '') {
  let parent = data;
  const result = [];

  for (const key in parent) {
    if (key === '__compat') {
      lastCompatData = parent[key];
    }

    if (key === 'version_added' && parent.version_added === false && !parent.impl_url) {
      const bcdPath = path.substring(0, path.length - 1);
      const bcdPathParts = bcdPath.split(".");
      const browser = bcdPathParts.pop();
      bcdPathParts.pop();
      bcdPathParts.pop();
      const bcdKey = bcdPathParts.join(".");

      return {
        bcdKey,
        browser,
        spec_url: lastCompatData.spec_url,
        mdn_url: lastCompatData.mdn_url,
        description: lastCompatData.description,
      };
    }

    if (typeof parent[key] === 'object') {
      result.push(walkBCD(parent[key], path + key + '.'));
    }
  }

  const flatResult = result.flat().filter((x) => !!x);
  return flatResult.length ? flatResult : null;
}

function findMissingImplUrlsForUnimplementedFeatures() {
  const allData = [];
  const perBrowserData = {};

  // Walking through the entire BCD data.
  const results = walkBCD(bcd);

  if (results) {
    for (const result of results) {
      if (IGNORE_BROWSERS.includes(result.browser) ||
          IGNORE_BCD_PREFIXES.some((prefix) => result.bcdKey.startsWith(prefix)) ||
          !result.mdn_url) {
        continue;
      }

      allData.push({ ...result });

      if (!perBrowserData[result.browser]) {
        perBrowserData[result.browser] = [];
      }
      perBrowserData[result.browser].push({ ...result });
    }
  }

  return { allData, perBrowserData };
}

function main() {
  const missingImplUrls = findMissingImplUrlsForUnimplementedFeatures();
  console.log(JSON.stringify(missingImplUrls.allData, null, 2));
}

main();
