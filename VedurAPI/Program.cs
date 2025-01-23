var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//Cors added to allow for localhost connection to the React app
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173");
                      });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

Helpers helpers = new Helpers();

app.MapGet("vedur/station/{id}", async (string id) =>
{
    var url = $"https://xmlweather.vedur.is/?op_w=xml&type=forec&lang=is&view=xml&ids={id}";
    using var client = new HttpClient();

    try
    {
        var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();


        var station = helpers.ParseWeatherXML(responseBody);

        if(station == null){
            return Results.NotFound($"The station with id: {id} was not found, please try another");
        }

        return Results.Ok(station);
    }
    catch (HttpRequestException e)
    {
        //Idially this would be writing to a logging service
        Console.WriteLine($"Request error: {e.Message}");
        return Results.InternalServerError("An error occured, please contact support");
    }
}).WithName("Vedur");

app.UseCors(MyAllowSpecificOrigins);

app.Run();