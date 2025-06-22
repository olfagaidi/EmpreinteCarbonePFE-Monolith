CREATE DATABASE AuthSystemDB;

GO

USE AuthSystemDB;
GO

-- Table des utilisateurs

CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Username NVARCHAR(100),
    Email NVARCHAR(255),
    PasswordHash VARBINARY(MAX),
    PasswordSalt VARBINARY(MAX),
    Is_Verified BIT,
    User_Role NVARCHAR(50),
    Is_Archived BIT,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Phone NVARCHAR(50),
    BirthDate DATETIME,
    JobTitle NVARCHAR(100),
    Department NVARCHAR(100),
    Location NVARCHAR(100),
    Manager NVARCHAR(100),
    Photo NVARCHAR(MAX)
);

GO

-- Table TransportData

CREATE TABLE TransportData (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Distance FLOAT,
    VehicleType NVARCHAR(100),
    FuelType NVARCHAR(50),
    Consumption FLOAT,
    LoadFactor FLOAT,
    DepartureLocation NVARCHAR(100),
    ArrivalLocation NVARCHAR(100),
    Emission FLOAT,
    UserId UNIQUEIDENTIFIER,
    DateTime DATETIME
);

GO

-- Table WarehouseData

CREATE TABLE WarehouseData (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Area FLOAT,
    EnergyType NVARCHAR(100),
    EnergyConsumption FLOAT,
    HeatingConsumption FLOAT,
    DateTime DATETIME,
    UserId UNIQUEIDENTIFIER,
    Emission FLOAT
);

GO

-- Table PackagingData

CREATE TABLE PackagingData (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    PackagingType NVARCHAR(100),
    Weight FLOAT,
    Quantity INT,
    DateTime DATETIME,
    PalletCount INT,
    PalletWeight FLOAT,
    PalletType NVARCHAR(50),
    Emission FLOAT,
    UserId UNIQUEIDENTIFIER
);

GO

-- Table WasteData

CREATE TABLE WasteData (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    WasteType NVARCHAR(100),
    Quantity FLOAT,
    TreatmentMethod NVARCHAR(100),
    UserId UNIQUEIDENTIFIER,
    DateTime DATETIME,
    Emission FLOAT
);

GO

-- Table EnergyData

CREATE TABLE EnergyData (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    EnergyType NVARCHAR(100),
    ElectricityConsumption FLOAT,
    HeatingConsumption FLOAT,
    Unit NVARCHAR(50),
    DateTime DATETIME,
    Emission FLOAT,
    UserId UNIQUEIDENTIFIER
);

GO

-- Table PrintingData

CREATE TABLE PrintingData (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Type NVARCHAR(100),
    PrintType NVARCHAR(50),
    Quantity INT,
    PaperType NVARCHAR(50),
    UserId UNIQUEIDENTIFIER,
    DateTime DATETIME,
    Emission FLOAT
);

GO
