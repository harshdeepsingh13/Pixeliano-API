const {logger} = require('../config/config');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');
const {setPostOnRss, getPosts} = require('../api/v1/Post/Post.model');
const {getUserDetails} = require('../api/v1/User/User.model');
//mongodb connection
require('../config/mongoose')();
const mongoose = require('mongoose');

const [userId, postId] = process.argv.slice(2);

process.on('exit', () => {
  logger.warn('Closing insertIntoFeed child process, and disconnecting mongoose connection');
  // mongoose.connection.on('close', () => logger.info(`Closing mongoose connection in insertInfoFeed child process.`));
  mongoose.disconnect(() => console.log('Disconnect insertInto Feeds '));

});

try {
  let fileJustCreated = false;
  const xmlBaseObject = {
    '$': {
      'xmlns:atom': 'http://www.w3.org/2005/Atom',
      'version': '2.0',
    },
    channel: {
      title: 'Pixeliano.HD',
      // link: 'https://verlocal.com/',
      description: 'This feed is powered by Pixeliano RSS service',
      lastBuildDate: new Date().toUTCString(),
      /*'atom:link': {
        '@': {
          'href': 'https://api.verlocal.com/api/auth',
          'rel': 'self',
        },
      },*/
      item: [],
    },
  };

  if (!fs.existsSync(path.join(__dirname, '../feeds'))) {
    fs.mkdirSync(path.join(__dirname, '../feeds'));
    logger.info(`'feeds' directory created`);
  }
  if (!fs.existsSync(path.join(__dirname, `../feeds/${userId}`))) {
    fs.mkdirSync(path.join(__dirname, `../feeds/${userId}`));
    fs.openSync(path.join(__dirname, `../feeds/${userId}/feed.xml`), 'a');
    fileJustCreated = true;
    logger.info(`directory for user id - ${userId} and empty file 'feed.xml' is created`);
  }

  (async () => {
    try {
      const {email: userEmail} = await getUserDetails('harshdeepsingh13@gmail.com', {email: 1});
      const {posts} = await getPosts(postId, 'postId');
      // throw new Error('just like that');
      if (posts.length) {
        const post = posts[0];
        if (fileJustCreated) {
          xmlBaseObject.channel.lastBuildDate = new Date().toUTCString();
          xmlBaseObject.channel.item.push(
            {
              title: post.caption.split(/\s+/).slice(0, 14).join(' '),
              description: post.caption,
              link: post.picture.fullUrl,
              pubDate: new Date(post.updatedAt).toUTCString(),
              guid: {
                '_': post.postId + '',
                '$': {
                  isPermaLink: false,
                },
              },
            },
          );
          let builder = new xml2js.Builder({rootName: 'rss'});
          let xml = builder.buildObject(xmlBaseObject, 'rss');
          let writeStream = fs.createWriteStream(path.join(__dirname, `../feeds/${userId}/feed.xml`), {flags: 'w'});
          writeStream.write(xml);
          writeStream.on('close', async () => {
            await setPostOnRss(post.postId, true);
            logger.info(`PostId ${post.postId} inserted in xml feed.`);
          });
          writeStream.close();
        } else {
          const xmlFeed = fs.readFileSync(path.join(__dirname, `../feeds/${userId}/feed.xml`));
          const jsFeed = await xml2js.parseStringPromise(xmlFeed);
          const itemIndex = jsFeed.rss.channel[0].item.findIndex(item => post.postId + '' === item.guid[0]['_']);
          if (itemIndex === -1) {
            jsFeed.rss.channel[0].item.push({
              title: post.caption.split(/\s+/).slice(0, 14).join(' '),
              description: post.caption,
              link: post.picture.fullUrl,
              pubDate: new Date(post.updatedAt).toUTCString(),
              guid: {
                '_': post.postId + '',
                '$': {
                  isPermaLink: false,
                },
              },
            });
          } else {
            jsFeed.rss.channel[0].item = [
              ...jsFeed.rss.channel[0].item.slice(0, itemIndex),
              {
                title: post.caption.split(/\s+/).slice(0, 14).join(' '),
                description: post.caption,
                link: post.picture.fullUrl,
                pubDate: new Date().toUTCString(),
                guid: {
                  '_': post.postId + '',
                  '$': {
                    isPermaLink: false,
                  },
                },
              },
              ...jsFeed.rss.channel[0].item.slice(itemIndex + 1),
            ];
          }
          let builder = new xml2js.Builder({rootName: 'rss'});
          let xml = builder.buildObject(jsFeed.rss, 'rss');
          let writeStream = fs.createWriteStream(path.join(__dirname, `../feeds/${userId}/feed.xml`), {flags: 'w'});
          writeStream.write(xml);
          writeStream.on('close', async () => {
            await setPostOnRss(post.postId, true);
            logger.info(`PostId ${post.postId} inserted in xml feed.`);
          });
          writeStream.end();
        }
      }
    } catch (e) {
      logger.error(`Error in InsertIntoFeed child process. Exiting the process - ${e}`);
      process.exit(0);
    }
  })();

} catch (e) {
  logger.error(`Error in InsertIntoFeed child process. Exiting the process - ${e}`);
  process.exit(0);
}
