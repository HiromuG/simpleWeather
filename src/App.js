import './App.css';
import arrowPng from './source/arrow.png'
import {useState,useRef} from 'react'

function App() {
  const [selectText,setSelectText]=useState('請選擇所在區域');
  const [list,setList]=useState('hide');
  const [arrow,setArrow]=useState('arrow');
  const [loader,setLoader]=useState('hideLoader');
  const [result,setResult]=useState('result');

  const Taipei = useRef("臺北");
  const Taichung = useRef("臺中");
  const Kaohsiung = useRef("高雄");
  let dayNight = useRef('');

  const [weather,setWeather]=useState({
    observationTime: Date.now(),
    locationName:'',
    description:'',
    temperature:'',
    windSpeed:'',
    humid:'',
  })
  const [weatherSituation,setWeatherSituation]=useState({
    description:'',
    weatherCode:'',
    rainPossibility:'',
    comfortability:''
  })
  
  const loading = ()=>{
    setResult('result')
    setLoader('loader')
  }
  const hideLoading = ()=>{
    setLoader('hideLoader')
  }
  const showResult = ()=>{
    setResult('showResult')
  }
  const setSelectedText = (e)=>{
    setSelectText(e.current.innerText);
    list==='hide'?setList('show'):setList('hide');
    toggleArrow();
  }
  const toggleList = ()=>{
    list==='hide'?setList('show'):setList('hide');
    toggleArrow();
  }
  const toggleArrow = ()=>{
    arrow==='arrow'?setArrow('arrowToggle'):setArrow('arrow');
  }
  const locationClick = (e)=>{
    console.log('----------------------',e);
    loading();
    setTimeout(()=>{
      hideLoading()
    },1000)
    setTimeout(()=>{
      showResult()
    },1001)
    /////////////////////////////////////////////////
    fetch
    (`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-9D9428B8-AC6C-4CE6-932C-6B6C12DBB091&locationName=${e.current.innerText}`)
    .then((response)=>response.json())
    .then((data)=>{
      const locationData = data.records.location[0];
      setWeather({ 
        observationTime: Date.now(),
        locationName: locationData.locationName,
        description: locationData.weatherElement[20].elementValue,
        temperature: locationData.weatherElement[3].elementValue,
        windSpeed: locationData.weatherElement[2].elementValue,
        humid: locationData.weatherElement[4].elementValue,
      })
      console.log('data',data);
    }).catch(error=>{
      console.log(error)
    })
    ///////////////////////////////////////////////
    fetch
    (`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-9D9428B8-AC6C-4CE6-932C-6B6C12DBB091&locationName=${e.current.innerText}市`)
    .then((response)=>response.json())
    .then((data)=>{
      const location = data.records.location[0];
      setWeatherSituation({
        description: location.weatherElement[0].time[0].parameter.parameterName,
        // weatherCode: location.weatherElement[0].time[0].parameter.parameterValue,
        rainPossibility: location.weatherElement[1].time[0].parameter.parameterName,
        comfortability: location.weatherElement[3].time[0].parameter.parameterName
      })
      console.log()
      console.log('data',data)
    }).catch(error=>{
      console.log(error)
    })
    //////////////////////////////////////////////
    const time = new Date().getHours();
    if(time>=5 && time<18){
        dayNight.ref = '白天'
    }else{
      dayNight.ref = '晚上'
    }
  }

  return (
    <div className="app">
    <h3 className='time'> 
      {new Intl.DateTimeFormat('zh-TW', {
          year: 'numeric',
          month: 'numeric', 
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(new Date(weather.observationTime))}
    </h3>
      <div className='locationSelect'>
        <div className='selector'>
          <p className='alert'>請勿星爆他</p>
          <div id='selectField' onClick={toggleList}>
            <p>{selectText}</p>
            <img src={arrowPng} alt='' className={arrow}/>
          </div>
          <ul id='list' className={list}>
            <li className='options' ref={Taipei} onClick={()=>{setSelectedText(Taipei);locationClick(Taipei)}}>
              <p>臺北</p>
            </li>
            <li className='options' ref={Taichung} onClick={()=>{setSelectedText(Taichung);locationClick(Taichung)}}>
              <p>臺中</p>
            </li>
            <li className='options' ref={Kaohsiung} onClick={()=>{setSelectedText(Kaohsiung);locationClick(Kaohsiung)}}>
              <p>高雄</p>
            </li>
          </ul>
        </div>
      </div>
      {/* //////////////////////////////////////////////// */}
      <div className={loader}></div>
      { weather.locationName !== "" &&
      <div className={result}>
        <div className='displayBox'>
          <h2 className='city'>{selectText}</h2>
          <h3 className='feel'>{weatherSituation.comfortability}</h3>
          <h1 className='temperature'>{Math.round(weather.temperature)}°C</h1>
          <h2 className='rain'>降雨機率：<span>{weatherSituation.rainPossibility} </span>%
          <img className='weatherIcon' src={require(`./source/${dayNight.ref+weather.description}.svg`)} alt=''/>
          </h2>
          <h2 className='description'>{weatherSituation.description}</h2>
        </div>
        <div className='displayBottom'>
          <div className='humidity'>
            <p>濕度：{weather.humid * 100}%</p>
          </div>
          <div className='wind'>
            <p>風速：{weather.windSpeed} m/h</p>
          </div>
        </div>
      </div>
      }
    </div>
  );
}

export default App;
