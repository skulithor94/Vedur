import { useEffect, useState } from "react";
import "./WeatherStation.css";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

export interface Station {
  id: number;
  valid: boolean;
  name: string;
  atime: Date;
  error: string;
  link: string;
  forecasts: Forecast[];
}

export interface Forecast {
  forecastTime: Date;
  windSpeed: number;
  windDirection: string;
  weather: string;
  temperature: number;
}

const DEFAULT_STATION = 1475; //Default to Reykjavik weather station on startup

export const WeatherStation = () => {
  const [currentStationId, setCurrentStationId] =
    useState<number>(DEFAULT_STATION);
  const [currentStation, setCurrentStation] = useState<Station | undefined>();
  const [errorMessage, setErrorMessage] = useState<string>();

  //The loading functionality is not very visible when we are using localhost and causes a flicker.
  //I put this here on principle because the user should always see some kind
  //of loading indicator when the server is being contacted.
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //We add a debounce to the on change handler both for a better user experience
  //but also so we don't send to many extra requests to the backend if the user is still
  //typing in a weather station id
  useEffect(() => {
    const handler = setTimeout(() => {
      if (currentStationId !== null) {
        getData();
      }
    }, 500);

    const getData = async () => {
      const url = `http://localhost:5000/vedur/station/${currentStationId}`;
      try {
        setIsLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 404) {
            setErrorMessage(
              `The weather station with id: ${currentStationId} was not found, please try another`
            );
          } else {
            setErrorMessage(
              "An error occured while fetching forecast data, please try again."
            );
          }
        }

        const json = await response.json();
        setCurrentStation(json);
      } catch {
        setErrorMessage(
          "An error occured while fetching forecast data, please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    return () => {
      clearTimeout(handler);
    };
  }, [currentStationId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStationId(Number(event.target.value));

    //When there is a change of Ids we need to reset the error message to allow for showing new data.
    setErrorMessage("");
    setCurrentStation(undefined);
  };

  return (
    <div className="container">
      <div className="header-fixed">
        <div className="header">
          <TextField
            id="standard-basic"
            label="Please select a weather station"
            variant="standard"
            type="number"
            onChange={handleInputChange}
            value={currentStationId}
          />
        </div>

        {errorMessage && (
          <Typography variant="body1" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        {isLoading ? (
          <Typography variant="body1" gutterBottom>
            Loading
          </Typography>
        ) : null}
        {currentStation && !errorMessage && !isLoading && (
          <div className="data-container">
            <Typography variant="body1" gutterBottom>
              Currently selected weather station: {currentStation.name}
            </Typography>
            <Button
              href={currentStation.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              See more
            </Button>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Weather</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Wind Speed m/s</TableCell>
                    <TableCell>Wind direction</TableCell>
                    <TableCell>Temperature °C</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentStation.forecasts?.map((forecast, index) => {
                    const forecastDate = new Date(forecast.forecastTime);
                    const formattedDate = forecastDate.toLocaleString("is-IS", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <TableRow key={index}>
                        <TableCell>{forecast.weather}</TableCell>
                        <TableCell>{formattedDate}</TableCell>
                        <TableCell>{forecast.windSpeed}</TableCell>
                        <TableCell>{forecast.windDirection}</TableCell>
                        <TableCell>{forecast.temperature}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
};
