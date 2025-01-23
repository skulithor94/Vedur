import { useEffect, useState } from 'react'
import './WeatherStation.css'

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

const DEFAULT_STATION = 1475 //Default to Reykjavik weather station on startup

export const WeatherStation = () => {

    const [currentStationId, setCurrentStationId] = useState<number>(DEFAULT_STATION);
    const [debouncedStationId, setDebouncedStationId] = useState<number>(DEFAULT_STATION);
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
            setDebouncedStationId(currentStationId);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [currentStationId]);

    useEffect(() => {
        async function getData() {
            const url = `http://localhost:5000/vedur/station/${currentStationId}`;
            try {
                setIsLoading(true);
                const response = await fetch(url);
                if (!response.ok) {
                    if (response.status === 404) {
                        setErrorMessage(`The weather station with id: ${currentStationId} was not found, please try another`);
                    } else {
                        setErrorMessage("An error occured while fetching forecast data, please try again.");
                    }
                }

                const json = await response.json();
                setCurrentStation(json);
            } catch (error: any) {
                setErrorMessage("An error occured while fetching forecast data, please try again.");
            } finally {
                setIsLoading(false);
            }
        }
        getData();
    }, [debouncedStationId])

    const handleInputChange = (event: any) => {
        setCurrentStationId(Number(event.target.value))

        //When there is a change of Ids we need to reset the error message to allow for showing new data.
        setErrorMessage("")
        setCurrentStation(undefined)
    }

    return (
        <>
            <div>
                <div>
                    <label>Please select a weather station: </label>
                    <input type='number' value={currentStationId} onChange={handleInputChange} />
                </div>

                {errorMessage && (
                    <div>{errorMessage}</div>
                )}
                {isLoading ? <span>Loading</span> : null}
                {currentStation && !errorMessage && !isLoading && (
                    <>
                        <div>Currently selected weather station:{currentStation.name}</div>
                        <div>
                            <a href={currentStation.link} target="_blank" rel="noopener noreferrer">Link to more info</a>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Weather</th>
                                        <th>Time</th>
                                        <th>Wind Speed m/s</th>
                                        <th>Wind direction</th>
                                        <th>Temperature °C</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStation.forecasts?.map((forecast, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{forecast.weather}</td>
                                                <td>{forecast.forecastTime.toLocaleString()}</td>
                                                <td>{forecast.windSpeed}</td>
                                                <td>{forecast.windDirection}</td>
                                                <td>{forecast.temperature}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
