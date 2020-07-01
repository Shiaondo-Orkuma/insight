module.exports = {
  siteMetadata: {
    title: `Tech  Business Insights and DevOps`,
    name: `Dev Auto`,
    siteUrl: `https://devauto.netlify.app/`,
    description: `All things DevOps, Automation and Test driven`,
    hero: {
      heading: `Welcome to Deve Automation, the home for elegant DevOps solutions..`,
      maxWidth: 652,
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/Nalexgee1/`,
      },
      {
        name: `github`,
        url: `https://github.com/Shiaondo-Orkuma/`,
      },
      {
        name: `instagram`,
        url: `https://instagram.com/`,
      },
      {
        name: `linkedin`,
        url: `https://www.linkedin.com/in/orkuma-shiaondo-6528b7124/`,
      },
      {
        name: `dribbble`,
        url: `https://dribbble.com/`,
      },
    ],
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: true,
        sources: {
          local: true,
          // contentful: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Novela by Narative`,
        short_name: `Novela`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {},
    },
  ],
};
