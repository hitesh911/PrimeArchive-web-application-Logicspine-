module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('assets');
    eleventyConfig.addPassthroughCopy('./src/css');
    eleventyConfig.addPassthroughCopy('./src/js');
    eleventyConfig.setFrontMatterParsingOptions({
        language: "json", // default is "yaml"
      });
    return {
        passthroughFileCopy: true,
        dir: {
            input: "src",
            output: "public"
        }
    };
};