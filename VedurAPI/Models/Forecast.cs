public class Forecast
{
    public DateTime ForecastTime { get; set; }
    public int WindSpeed { get; set; }
    public required string WindDirection { get; set; }
    public int Temperature { get; set; }
    public required string Weather { get; set; }
}