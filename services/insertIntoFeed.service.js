const {logger} = require('../config/config');
const xml2js = require('xml2js');
const {setPostOnRss, getPosts} = require('../api/v1/Post/Post.model');
const {getUserDetails} = require('../api/v1/User/User.model');
//mongodb connection
require('../config/mongoose')();
const mongoose = require('mongoose');
const {updateXmlId} = require('../api/v1/User/User.model');
const {saveXml} = require('../api/v1/User/User.model');
const {uploadCloudinaryXml, deleteFromCloudinary, getCloudinaryXml} = require('./cloudinary.service');

const [userId, postId] = process.argv.slice(2);

process.on('exit', () => {
  logger.warn('Closing insertIntoFeed child process, and disconnecting mongoose connection');
  // mongoose.connection.on('close', () => logger.info(`Closing mongoose connection in insertInfoFeed child process.`));
  mongoose.disconnect(() => console.log('Disconnect insertInto Feeds '));

});

try {
  const xmlBaseObject = {
    '$': {
      'xmlns:atom': 'http://www.w3.org/2005/Atom',
      'version': '2.0',
    },
    channel: {
      title: 'Pixeliano.HD',
      link: 'https://pixeliano.herokuapp.com',
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

  /*if (!fs.existsSync(path.join(__dirname, '../feeds'))) {
    fs.mkdirSync(path.join(__dirname, '../feeds'));
    logger.info(`'feeds' directory created`);
  }
  if (!fs.existsSync(path.join(__dirname, `../feeds/${userId}`))) {
    fs.mkdirSync(path.join(__dirname, `../feeds/${userId}`));
    fs.openSync(path.join(__dirname, `../feeds/${userId}/feed.xml`), 'a');
    fileJustCreated = true;
    logger.info(`directory for user id - ${userId} and empty file 'feed.xml' is created`);
  }*/

  (async () => {
    try {
      const [userDetails] = await getUserDetails(userId, {email: 1, xml: 1}, 'userId');
      const {posts} = await getPosts(postId, 'postId');
      // throw new Error('just like that');
      if (posts.length) {
        const post = posts[0];
        if (!userDetails.xml.length) {
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
          const {public_id, secure_url} = await uploadCloudinaryXml(xml, userId);
          const {resourceId} = await saveXml({fullUrl: secure_url, shortName: public_id});
          await updateXmlId(userId, resourceId, 'userId');
          await setPostOnRss(post.postId, true);
          logger.info(`PostId ${post.postId} inserted in XML with resourceId ${resourceId}`)
        } else {
          const xmlFeed = await getCloudinaryXml(userDetails.xml[0].shortName);
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
          /*let writeStream = fs.createWriteStream(path.join(__dirname, `../feeds/${userId}/feed.xml`), {flags: 'w'});
          writeStream.write(xml);
          writeStream.on('close', async () => {
            await setPostOnRss(post.postId, true);
            logger.info(`PostId ${post.postId} inserted in xml feed.`);
          });
          writeStream.end();*/
          await deleteFromCloudinary(userDetails.xml[0].shortName, 'raw');
          logger.info(`Existing XML with resourceId - ${userDetails.xml[0].resourceId} deleted.`);
          const {public_id, secure_url} = await uploadCloudinaryXml(xml, userId);
          const {resourceId} = await saveXml({fullUrl: secure_url, shortName: public_id});
          await updateXmlId(userId, resourceId, 'userId');
          await setPostOnRss(post.postId, true);
          logger.info(`PostId ${post.postId} inserted in XML with resourceId ${resourceId}`)
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
