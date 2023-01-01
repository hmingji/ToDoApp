FROM mcr.microsoft.com/dotnet/runtime:7.0 AS base
WORKDIR /app

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Services/EmailNotification/EmailNotification.Worker/EmailNotification.Worker.csproj", "Services/EmailNotification/EmailNotification.Worker/"]
COPY ["BuildingBlocks/EventBus.Messages/EventBus.Messages.csproj", "BuildingBlocks/EventBus.Messages/"]
RUN dotnet restore "Services/EmailNotification/EmailNotification.Worker/EmailNotification.Worker.csproj"
COPY . .
WORKDIR "/src/Services/EmailNotification/EmailNotification.Worker"
RUN dotnet build "EmailNotification.Worker.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EmailNotification.Worker.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EmailNotification.Worker.dll"]
