import Parser from "rss-parser";

const parser = new Parser();

export const fetchPosts = async () => {
  try {
    const feed = await parser.parseURL("https://rss.nytimes.com/services/xml/rss/nyt/World.xml"); // Replace with your RSS feed URL
    return feed.items;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
};
