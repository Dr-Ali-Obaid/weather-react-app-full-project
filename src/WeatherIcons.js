import React from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";

export function WeatheIcons({ weatherCodes }) {
  let Icon = WbSunnyIcon;

  if (weatherCodes == 1) {
    Icon = CloudQueueIcon;
  } else if (weatherCodes == 2 || weatherCodes == 3) {
    Icon = CloudIcon;
  } else if (weatherCodes == 51 || weatherCodes == 53 || weatherCodes == 55) {
    Icon = ThunderstormIcon;
  }

  return <Icon style={{ fontSize: "150" }}/>;
}
