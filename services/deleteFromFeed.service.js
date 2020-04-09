const mongoose = require('mongoose');
const {logger} = require('../config/config');
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const {updateXmlId} = require('../api/v1/User/User.model');
const {saveXml} = require('../api/v1/User/User.model');
const {uploadCloudinaryXml, deleteFromCloudinary, getCloudinaryXml} = require('./cloudinary.service');
const {getUserDetails} = require('../api/v1/User/User.model');
const {setPostOnRss} = require('../api/v1/Post/Post.model');

const [userId, postId] = process.argv.slice(2);

process.on('exit', () => {
  logger.warn('Closing insertIntoFeed child process, and disconnecting mongoose connection');
  // mongoose.connection.on('close', () => logger.info(`Closing mongoose connection in insertInfoFeed child process.`));
  mongoose.disconnect(() => console.log('Disconnect insertInto Feeds '));

});
try {
  /*if (!fs.existsSync(path.join(__dirname, '../feeds'))) {
    throw new Error('No \'feeds\' directory');
  }
  if (!fs.existsSync(path.join(__dirname, `../feeds/${userId}`))) {
    throw new Error(`No '/feeds/${userId}' directory`);
  }
  if (!fs.existsSync(path.join(__dirname, `../feeds/${userId}/feed.xml`))) {
    throw new Error('No \'feed.xml\' file');
  }*/
  (async () => {
    try {
      // const xmlFeed = fs.readFileSync(path.join(__dirname, `../feeds/${userId}/feed.xml`));
      const [userDetails] = await getUserDetails(userId, {email: 1, xml: 1}, 'userId');
      if (userDetails.xml.length) {
        const xmlFeed = await getCloudinaryXml(userDetails.xml[0].shortName);
        const jsFeed = await xml2js.parseStringPromise(xmlFeed);
        const itemIndex = jsFeed.rss.channel[0].item.findIndex(item => postId + '' === item.guid[0]['_']);
        if (itemIndex === -1) {
          throw new Error('Post not found in xml');
        }
        jsFeed.rss.channel[0].item = [
          ...jsFeed.rss.channel[0].item.slice(0, itemIndex),
          ...jsFeed.rss.channel[0].item.slice(itemIndex + 1),
        ];
        let builder = new xml2js.Builder({rootName: 'rss'});
        let xml = builder.buildObject(jsFeed.rss, 'rss');
        /*let writeStream = fs.createWriteStream(path.join(__dirname, `../feeds/${userId}/feed.xml`), {flags: 'w'});
        writeStream.write(xml);
        writeStream.on('close', async () => {
          logger.info(`PostId ${postId} deleted from xml feed.`);
          await setPostOnRss(postId, false);
          logger.info(`PostId ${postId} set rss false in DB.`);
        });
        writeStream.end();*/
        await deleteFromCloudinary(userDetails.xml[0].shortName, 'raw');
        logger.info(`Existing XML with resourceId - ${userDetails.xml[0].resourceId} deleted.`);
        const {public_id, secure_url} = await uploadCloudinaryXml(xml, userId);
        const {resourceId} = await saveXml({fullUrl: secure_url, shortName: public_id});
        await updateXmlId(userId, resourceId, 'userId');
        await setPostOnRss(postId, false);
        logger.info(`PostId ${postId} delete from XML with resourceId ${resourceId}`)
      } else{
        throw new Error('No \'xml\' resource id.');
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
