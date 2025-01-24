namespace VedurAPI.Tests;

public class WeatherStationTests
{
    readonly Helpers helpers;

    public WeatherStationTests()
    {
        helpers = new Helpers();
    }

    [Fact]
    public void ParseWeatherXML_Return_Null_When_Empty_String()
    {
        var returnValue = helpers.ParseWeatherXML("");

        Assert.Null(returnValue);
    }

    [Fact]
    public void ParseWeatherXML_Return_Null_When_No_Station_Element()
    {
        var mockXml = "<forecasts></forecasts>";

        var returnValue = helpers.ParseWeatherXML(mockXml);

        Assert.Null(returnValue);
    }

    [Fact]
    public void ParseWeatherXML_Return_Valid_Object_When_Valid_XML()
    {
        var mockXml = @"
        <forecasts>
            <station id='1' valid='1'>
                <name>Reykjavík</name>
                <atime>2025-01-23 12:00:00</atime>
                <err/>
                <link>
                <![CDATA[
                http://www.vedur.is/vedur/spar/stadaspar/hofudborgarsvaedid/#group=100&station=1
                ]]>
                </link>
                <forecast>
                    <ftime>2025-01-23 13:00:00</ftime>
                    <F>7</F>
                    <D>A</D>
                    <T>3</T>
                    <W>Lítils háttar rigning</W>
                </forecast>
            </station>
        </forecasts>";

        var returnValue = helpers.ParseWeatherXML(mockXml);

        Assert.NotNull(returnValue);
        Assert.Equal(1, returnValue.Id);
        Assert.Equal("Reykjavík", returnValue.Name);
    }
}
