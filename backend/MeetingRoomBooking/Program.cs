using MeetingRoomBooking.Data;
using Microsoft.EntityFrameworkCore;
using MeetingRoomBooking.Configuration;


var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<BookingSettings>(
    builder.Configuration.GetSection("BookingSettings"));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("MyDatabase"));


// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    SeedData.Initialize(context);
}
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
