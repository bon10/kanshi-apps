# Kanshi Apps

===

This node app monitors the update of the specified Google Play and App Store applications to notifies Slack.

## Required

* Docker
* docker-compose

## How to

First, you try `git clone` this repogitory.  
Second, write the `ios.txt` what the appID of the iOS Apps that you want to monitor.  
If Android Apps, it writes applicationId to the `android.txt`.  
(Both it can write multiple applications as using line breaks)

e.g.
  ios.txt:     appID of LINE  
  android.txt: applicationId of Instagram

Finally, follow the steps below there:

```
$ cd kanshi_apps
$ echo SLACK_WEBHOOK_URL=XXXXXX(your slack webhook url) > .env
$ docker-compose up -d
```


## NOTE

This app is using CronJob for Node.js and it running the monitoring at every 59 minutes.
So if you'll change interval the monitoring, please edit `app-server/index.js`.

Also, I chose the Timezone for 'Japan'. This is the necessary change to do by your environment.  
(We are sorry, but console logs and messages are only in Japanese!)

## TODO

* Apply multi-languages
* Apply mutable timezone


## License

MIT
