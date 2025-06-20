using EmpreintCarbone.Application.DTOs;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace EmpreintCarbone.Application.Helpers
{
    public class UserEmissionReportDocument : IDocument
    {
        private readonly IEnumerable<TransportDataDto> _transportData;
        private readonly IEnumerable<WarehouseDataDto> _warehouseData;
        private readonly IEnumerable<PackagingDataDto> _packagingData;
        private readonly IEnumerable<WasteDataDto> _wasteData;
        private readonly IEnumerable<EnergyDataDto> _energyData;
        private readonly IEnumerable<PrintingDataDto> _printingData;

        public UserEmissionReportDocument(
            IEnumerable<TransportDataDto> transportData,
            IEnumerable<WarehouseDataDto> warehouseData,
            IEnumerable<PackagingDataDto> packagingData,
            IEnumerable<WasteDataDto> wasteData,
            IEnumerable<EnergyDataDto> energyData,
            IEnumerable<PrintingDataDto> printingData)
        {
            _transportData = transportData;
            _warehouseData = warehouseData;
            _packagingData = packagingData;
            _wasteData = wasteData;
            _energyData = energyData;
            _printingData = printingData;
        }

        private const double EmissionThreshold = 500.0; 

        private const string HighEmissionAdvice =
            "Vos émissions sont supérieures aux niveaux recommandés. Veuillez envisager de:\n" +
            "- Réduire l'utilisation de la voiture ou passer à un moyen de transport électrique.\n" +
            "- Optimiser la consommation énergétique des entrepôts.\n" +
            "- Réduire les emballages et les déchets.\n" +
            "- Utiliser des sources d’énergie renouvelables lorsque cela est possible.";

        private const string GoodEmissionMessage =
            "Félicitations ! Vos émissions sont conformes aux seuils recommandés et reflètent un comportement respectueux de l’environnement.\n" +
            "Poursuivez vos efforts actuels afin de préserver une empreinte carbone durable et contribuer activement à la protection de l’environnement.";



        private double CalculateTotalEmission()
        {
            return _transportData.Sum(x => x.Emission)
                 + _warehouseData.Sum(x => x.Emission)
                 + _packagingData.Sum(x => x.Emission)
                 + _wasteData.Sum(x => x.Emission)
                 + _energyData.Sum(x => x.Emission)
                 + _printingData.Sum(x => x.Emission);
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Margin(30);
                page.Size(PageSizes.A4);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12));

                page.Header()
    .Column(column =>
    {
        column.Item().Text("Carbon Footprint–TraLIS")
            .FontSize(25)
            .Bold()
            .FontColor("#10B981") 
            .AlignCenter();

        column.Item().Text("Module de calcul d'empreinte carbone")
            .FontSize(12)
            .FontColor("#6B7280") 
            .AlignCenter();
    });


                page.Content().PaddingVertical(15).Element(content =>
                {
                    content.Column(column =>
                    {
                        ComposeContent(column);

                        double totalEmission = CalculateTotalEmission();

                        column.Item().PaddingTop(30).BorderTop(1).PaddingTop(10).Element(footer =>
                        {
                            if (totalEmission > EmissionThreshold)
                            {
                                footer.Border(1)
                                      .Background(Colors.Red.Lighten4)
                                      .Padding(10)
                                      .Column(col =>
                                      {
                                          col.Item().Text("⚠ Émissions élevées détectées").Bold().FontSize(14).FontColor(Colors.Red.Medium);
                                          col.Item().Text(HighEmissionAdvice).FontColor(Colors.Black);
                                          col.Item().Text($"Émissions totales: {totalEmission:0.##} kg CO₂").FontColor(Colors.Red.Darken1).Bold();
                                      });
                            }
                            else
                            {
                                footer.Border(1)
                                      .Background(Colors.Green.Lighten4)
                                      .Padding(10)
                                      .Column(col =>
                                      {
                                          col.Item().Text("✅ Niveau d’émissions : Satisfaisant").Bold().FontSize(14).FontColor(Colors.Green.Medium);
                                          col.Item().Text(GoodEmissionMessage).FontColor(Colors.Black);
                                          col.Item().Text($"Total Emissions: {totalEmission:0.##} kg CO₂").FontColor(Colors.Green.Darken1).Bold();
                                      });
                            }
                        });
                    });
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
        }


        void ComposeContent(ColumnDescriptor column)
        {
            column.Item().Element(container =>
            {
                container.Column(innerColumn =>
                {
                    AddEmissionTable(innerColumn, "Émissions liées au transport", "Type de carburant", _transportData.Select(x => (x.FuelType, x.Emission)));
                    AddEmissionTable(innerColumn, "Émissions des entrepôts", "Type d’énergie", _warehouseData.Select(x => (x.EnergyType, x.Emission)));
                    AddEmissionTable(innerColumn, "Émissions liées aux emballages", "Type d’emballage", _packagingData.Select(x => (x.PackagingType, x.Emission)));
                    AddEmissionTable(innerColumn, "Émissions dues aux déchets", "Type de déchet", _wasteData.Select(x => (x.WasteType, x.Emission)));
                    AddEmissionTable(innerColumn, "Émissions liées à l’énergie", "Type d’énergie", _energyData.Select(x => (x.EnergyType, x.Emission)));
                    AddEmissionTable(innerColumn, "Émissions liées à l’impression", "Type d’impression", _printingData.Select(x => (x.PrintType, x.Emission)));
                });
            });
        }

        void AddEmissionTable(ColumnDescriptor column, string title, string categoryHeader, IEnumerable<(string Category, double Emission)> data)
        {
            column.Item().PaddingTop(20).Text(title).Bold().FontSize(14).FontColor(Colors.Black);

            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(2);
                    columns.RelativeColumn(1);
                });

                table.Header(header =>
                {
                    header.Cell().Element(CellStyle).Text(categoryHeader).SemiBold();
                    header.Cell().Element(CellStyle).Text("Emissions (kg CO₂)").SemiBold();
                });

                foreach (var (category, emission) in data)
                {
                    table.Cell().Element(CellStyle).Text(category);
                    table.Cell().Element(CellStyle).Text($"{emission:0.##} kg");
                }
            });
        }

        static IContainer CellStyle(IContainer container)
        {
            return container
                .PaddingVertical(5)
                .PaddingHorizontal(10)
                .BorderBottom(1)
                .BorderColor(Colors.Grey.Lighten2);
        }

        public byte[] GeneratePdf()
        {
            return QuestPDF.Fluent.Document.Create(container =>
            {
                Compose(container);
            }).GeneratePdf();
        }
    }
}
