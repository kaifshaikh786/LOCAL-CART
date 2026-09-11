FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/LocalCart.Api/LocalCart.Api.csproj backend/LocalCart.Api/
RUN dotnet restore backend/LocalCart.Api/LocalCart.Api.csproj

COPY backend/LocalCart.Api/ backend/LocalCart.Api/
RUN dotnet publish backend/LocalCart.Api/LocalCart.Api.csproj \
    -c Release \
    -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .
COPY demo_marts_data_v4.csv /app/demo_marts_data_v4.csv

ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "LocalCart.Api.dll"]
