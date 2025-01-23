public class Station
{
    public int Id { get; set; }
    public int Valid { get; set; }
    public required string Name { get; set; }
    public DateTime Atime { get; set; }
    public required string Error { get; set; }
    public required string Link { get; set; }
    public required List<Forecast> Forecasts { get; set; }
}
