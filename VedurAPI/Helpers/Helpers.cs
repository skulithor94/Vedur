using System.Xml.Linq;

public class Helpers
{
   /// <summary>
   /// Function that parses xml weather forecast data and returns a more readble object.
   /// </summary>
   /// <param name="response">A valid response from a XML weather service</param>
   /// <returns>A station object with enclosed forecasts</returns>
   /// <exception cref="InvalidOperationException">Throws an exception if the data is not valid</exception>
    public Station? ParseWeatherXML(string response)
    {
        //We could look into throwing an error here instead of returning a null.
        if(string.IsNullOrEmpty(response)){
            return null;
        }

        var xml = XDocument.Parse(response);

        // Convert XML to Station to improve readability for the frontend
        var stationElement = xml.Root?.Element("station");

        if (stationElement == null)
        {
            return null;
        }

        //Turn the XML into a more readable object for the frontend.
        //This could probably be done better but I'm rusty in XML parsing.
        var station = new Station
        {
            Id = int.Parse(stationElement.Attribute("id")?.Value ?? throw new InvalidOperationException("Missing 'id' attribute.")),
            Valid = int.Parse(stationElement.Attribute("valid")?.Value ?? throw new InvalidOperationException("Missing 'valid' attribute")),
            Name = stationElement.Element("name")?.Value ?? throw new InvalidOperationException("Missing 'name' element."),
            Atime = DateTime.Parse(stationElement.Element("atime")?.Value ?? throw new InvalidOperationException("Missing 'atime' element.")),
            Error = stationElement.Element("err")?.Value ?? throw new InvalidOperationException("Missing 'err' element"),
            Link = stationElement.Element("link")?.Value ?? throw new InvalidOperationException("Missing 'link' element."),
            Forecasts = stationElement.Elements("forecast").Select(forecastElement => new Forecast
            {
                ForecastTime = DateTime.Parse(forecastElement.Element("ftime")?.Value ?? throw new InvalidOperationException("Missing 'ftime' element.")),
                WindSpeed = int.Parse(forecastElement.Element("F")?.Value ?? throw new InvalidOperationException("Missing 'F' element.")),
                WindDirection = forecastElement.Element("D")?.Value ?? throw new InvalidOperationException("Missing 'D' element."),
                Temperature = int.Parse(forecastElement.Element("T")?.Value ?? throw new InvalidOperationException("Missing 'T' element.")),
                Weather = forecastElement.Element("W")?.Value ?? throw new InvalidOperationException("Missing 'W' element.")
            }).ToList()
        };

        return station;
    }
}
