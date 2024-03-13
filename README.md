# BCD `impl_url` collector

This tool helps identify browser implementation bugs to be added to the [Browser Compatibility Data](https://github.com/mdn/browser-compat-data) project (BCD).

BCD tracks the implementation status of web platform features in browsers. For features that are not yet implemented, the `impl_url` field is useful to know what the relevant bug on a browser vendors' issue trackers is.

This tool lists features that are not implemented **and** which also don't have an `impl_url` field set in BCD. The tool produces a list of these features, with links to search engine results that may help identify the right bug to link to.

## Generate the data

Run the following commands to generate the new data. Every time you generate the data, the previous data is overwritten, and the latest version of BCD is fetched and built, from source.

```sh
# Install the dependencies.
npm install

# Get the latest version of BCD.
npm run get-bcd

# Build BCD
npm run build-bcd

# Generate the data
npm run generate

# Remove the BCD clone
npm run cleanup
```

## Visualize the data

Once the data is generated, it can be visualized in a web browser. To do so, run the following command:

```sh
npm run serve
```

And then open `http://localhost:8080` in your browser.

## About greyed-out features

Browsers don't always agree on web features that should be implemented on the platform. It's useless to look for a tracking bug on a browser vendor's issue tracker for a feature that the browser vendor has decided not to implement.

The `notes.json` file lists the web features that we know certain browsers will never implement. These features get greyed out in the visualization.
