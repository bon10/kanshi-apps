// Scraping
var gplay = require('google-play-scraper');
var store = require('app-store-scraper');

// filestream
var fs = require('fs');
var readline = require('readline');

// redis
var redis = require('redis');
var rc = redis.createClient(6379, "noderedis");
var listen_port = 10080;

// Slack
const { IncomingWebhook } = require('@slack/client');
const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

// Cron
const {CronJob} = require('cron');

// Moment
var moment = require("moment");

var notify = function(msg){
  //return false;
  webhook.send(msg, function(err, res) {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', res);
    }
  });
}


new CronJob('00 59 * * * *', () => {
  var android_list = readline.createInterface({ input: fs.createReadStream('./android.txt', 'utf8') });
  var ios_list = readline.createInterface({ input: fs.createReadStream('./ios.txt', 'utf8') });

  // Android
  android_list.on('line', (data) => {
    gplay.app({appId: data})
    .then(function(res) {
      console.log(res.title+ ": " + res.updated);
      console.log(moment(res.updated).format("DD MMM YYYY hh:mm a"));
      rc.get("Android_" + res.title, (err, reply) => {
        if(reply) {
          if(res.updated > reply) {
            console.log("新しいリリースを検知！！");
            // アップデート日を更新
            rc.set("Android_" + res.title, res.updated);
            notify(moment(res.updated).format("DD MMM YYYY hh:mm a") + "に、Androidの" + res.title + "がリリースされたみたい");
          }
        }else{
          // nullなら値をセットする
          rc.set("Android_"+ res.title, res.updated);
        }
      });
    })
    .catch(console.log);
  });


  // iOS
  ios_list.on('line', (data) => {
    store.app({id: data})
    .then(function(res) {
      rc.get("iOS_" + res.title, (err, reply) => {
        console.log(res.title + ": " + reply);
        if(reply) {
          //console.log(res.updated);
          //console.log(moment(res.updated).isSame(reply));
          if(moment(res.updated).isAfter(reply)) {
            console.log("新しいリリースを検知！！");
            // アップデート日を更新
            rc.set("iOS_" + res.title, res.updated);
            notify(res.updated + "に、iOSの" + res.title + "がリリースされたみたい");
          }
        }else{
          // nullなら値をセットする
          rc.set("iOS_" + res.title, res.updated);
        }
      });
    })
    .catch(console.log);
  });
}, null, true);
