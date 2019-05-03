function postSlackMessage() {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
 
  var slackApp = SlackApp.create(token); //SlackApp インスタンスの取得
 
  var options = {
    channelId: "#general", //チャンネル名
    message: getWeather() //投稿するメッセージ
  };
 
  slackApp.postMessage(options.channelId, options.message);
}

function getWeather() {
  var cityID = 130010;
  var url = 'http://weather.livedoor.com/forecast/webservice/json/v1?city=';
  var json = UrlFetchApp.fetch(url + cityID);
  
  var obj = JSON.parse(json.getContentText());
  
  Logger.log(obj)
  
  var prefecture = obj.location.prefecture;
  var day = obj.forecasts[0].dateLabel;
  var weather = obj.forecasts[0].image.title;
  // temperature={min={celsius=14, fahrenheit=57.2}, max={celsius=25, fahrenheit=77.0}}
  var minTemperature = obj.forecasts[0].temperature.min;
  var maxTemperature = obj.forecasts[0].temperature.max;
  Logger.log(minTemperature)
  if (minTemperature == null) {
    Logger.log("mmm");
  };
  
  
  var topSentence = day+"の"+prefecture+"の天気は『"+weather+"』です！\n";
  var bottomSentence;
  if (minTemperature == null){
    bottomSentence = "気温は自分で調べて！"
  } else {
    bottomSentence = "最低気温は"+minTemperature.celsius+"度、最高気温は"+maxTemperature.celsius+"です。"
  }
  
  Logger.log(topSentence+bottomSentence);
  
  return topSentence+bottomSentence;
  
}