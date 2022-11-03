#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["ToDoTask.API/ToDoTask.API.csproj", "Services/ToDoTask/ToDoTask.API/"]
RUN dotnet restore "Services/ToDoTask/ToDoTask.API/ToDoTask.API.csproj"
COPY ./ToDoTask.API ./Services/ToDoTask/ToDoTask.API
WORKDIR "/src/Services/ToDoTask/ToDoTask.API"
RUN dotnet build "ToDoTask.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ToDoTask.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ToDoTask.API.dll"]
