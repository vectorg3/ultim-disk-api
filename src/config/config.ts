export default () => ({
      jwt: {
            secret: process.env.JWT_SECRET
      },
      database: {
            uri: process.env.DATABASE_URI
      },
      filePath: process.env.FILE_PATH
});
