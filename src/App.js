import "./App.css";
import { useEffect, useState } from "react";

// my components
import { WeatheIcons } from "./WeatherIcons";

// Material UI
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


// external liberaries
import axios from "axios";
import moment  from "moment";
import "moment/locale/ar";
import { useTranslation } from 'react-i18next';


 

const theme = createTheme({
  typography: {
    fontFamily: "IBM",
  },
});

let cancel;

function App() {

  const { t, i18n } = useTranslation();

  const [date, setDate] = useState("")

  const [temp, setTemp] = useState({
    nowTemp: null,
    maxTemp: null,
    minTemp: null,
    description: "",
    icon: ""
  });
  

  const [lang, setLang] = useState("ar")

  function langHandler (){
    if(lang === "ar"){
      i18n.changeLanguage("en")
      
      setLang("en")
      moment.locale("en")
      
    }else{
      i18n.changeLanguage("ar")
      
      setLang("ar")
      moment.locale("ar")
     
    }
  }

  useEffect(()=>{
    setDate(moment().format('dddd D MMMM  YYYY '))
  }, [lang])
 
  useEffect(() => {
    axios
      .get(
        "https://api.open-meteo.com/v1/forecast?latitude=31.10631980&longitude=30.94197510&current=temperature_2m,weather_code,cloud_cover&daily=temperature_2m_max,temperature_2m_min&timezone=Africa%2FCairo&forecast_days=1",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancel = c;
          }),
        }
      )
      .then (function (response) {
        const responseTemp = Math.round (response.data.current.temperature_2m) ;
        const max = Math.round (response.data.daily.temperature_2m_max);
        const min = Math.round (response.data.daily.temperature_2m_min);
        const weatherCode = response.data.current.weather_code
        const weatherDescriptions = {
          
            0: "Clear",
            1: "Partly Cloudy",
            2: "Cloudy",
            3: "Overcast",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Heavy Drizzle"
        };
        const desc =  weatherDescriptions[weatherCode];
        // const icon = response.data.weather[0].icon;
        console.log(response)
        setTemp({
          nowTemp: responseTemp,
          maxTemp: max,
          minTemp: min,
          description: desc,
          icon: weatherCode
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    return () => {
      console.log("canceled");
      cancel();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Container maxWidth="sm" dir={lang == "ar"? "rtl": "ltr"}>
          <div
            className="card-container"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="card"
              style={{
                width: "100%",
                backgroundColor: "rgb(28 52 91 /36%)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 11px 3px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="content">
                <div
                  className="header"
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "right",
                  }}
                >
                  <Typography
                    variant="h4"
                    style={{ marginRight: "20px", marginLeft: "20px", fontWeight: "400" }}
                  >
                    {t ("Kafr El Sheikh")}
                  </Typography>
                  <Typography variant="h6" style={{ marginRight: "20px" }}>
                    {date} 
                  </Typography>
                </div>
                <hr />
                <div
                  className="body"
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div className="tempreture">
                    <Typography variant="h1" >
                      {temp.nowTemp}
                    </Typography>

                    <Typography variant="h5" >
                      {t(temp.description)}
                    </Typography>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <h5>{t("min")}: {temp.minTemp}</h5>  
                      <h5 style={{marginRight: "10px", marginLeft: "10px"}}>{t("max")}: {temp.maxTemp}</h5>
                    </div>
                  </div>
                  <div className="icon">
                    <WeatheIcons weatherCodes={temp.icon}  />
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{ textAlign: "left", width: "100%", marginTop: "20px" }}
            >
              <Button variant="text" style={{ color: "white", textTransform: "none"  }} onClick={langHandler}>
                {lang === "ar"? "إنجليزي" : "Arabic"}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
