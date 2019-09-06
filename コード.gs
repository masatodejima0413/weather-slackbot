function postSlackMessage() {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
 
  var slackApp = SlackApp.create(token); //SlackApp インスタンスの取得
 
  var options = {
    channelId: "#weather", //チャンネル名
    message: getWeatherFromOWMapi() //投稿するメッセージ
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


function getWeatherFromOWMapi() {
  
  var api_key = "2141a039723571b370b2343542950973"
  var tokyo_city_ID = "1850147"
  var urayasu_city_ID = "1849186"
  var url = "http://api.openweathermap.org/data/2.5/forecast?id="+urayasu_city_ID+"&APPID="+api_key
  
  var response = UrlFetchApp.fetch(url)
  var object = JSON.parse(response.getContentText())
  
  var city = object.city.name
  
  var outputInfo = []
  
  for (i=0;i<5;i++) {
    
    var list = object.list[i]
    var date = list.dt_txt
    var temp = list.main.temp
    var tempCelcius = Math.round((temp-273.15)*10)/10
    var description = list.weather[0].description
    
    var info = {
      date:date,
      tempCelcius:tempCelcius,
      description:description
    }
    
    outputInfo.push(info)
  }
  
  var message = ""
  
  for (j=0;j<5;j++){
    
    var partMessage = "\n"+outputInfo[j].date+"→"+outputInfo[j].description+"（"+outputInfo[j].tempCelcius+"℃)"
    
    var message = message + partMessage
  }
  
  var topMessage = city+" city weather every 3 hours"
  
  return topMessage + message
}