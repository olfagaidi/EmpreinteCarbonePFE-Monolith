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
        private readonly DateTime _generationTime;

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
            _generationTime = DateTime.UtcNow;
        }

        private const double EmissionThreshold = 500.0; 

        private const string HighEmissionAdvice =
            "Your emissions are higher than recommended. Please consider:\n" +
            "- Reducing car usage or switching to electric transport.\n" +
            "- Optimizing warehouse energy consumption.\n" +
            "- Minimizing packaging and waste.\n" +
            "- Using renewable energy sources when possible.";

        private const string GoodEmissionMessage =
            "Great job! Your emissions are within an environmentally friendly range.\n" +
            "Keep up the good practices to maintain a sustainable footprint.";



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

                // 👇 Replaced header starts here
                page.Header().Element(header =>
                {
                    header.Column(col =>
                    {
                        col.Item().Text("User Emission Report")
                            .FontSize(20)
                            .Bold()
                            .FontColor(Colors.Blue.Medium)
                            .AlignCenter();

                        col.Item().Text($"Generated on: {_generationTime:yyyy-MM-dd HH:mm:ss} UTC")
                            .FontSize(10)
                            .FontColor(Colors.Grey.Medium)
                            .AlignCenter();
                    });
                });
                // 👆 Replaced header ends here

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
                                          col.Item().Text("⚠ High Emissions Detected").Bold().FontSize(14).FontColor(Colors.Red.Medium);
                                          col.Item().Text(HighEmissionAdvice).FontColor(Colors.Black);
                                          col.Item().Text($"Total Emissions: {totalEmission:0.##} kg CO₂").FontColor(Colors.Red.Darken1).Bold();
                                      });
                            }
                            else
                            {
                                footer.Border(1)
                                      .Background(Colors.Green.Lighten4)
                                      .Padding(10)
                                      .Column(col =>
                                      {
                                          col.Item().Text("✅ Emission Status: Good").Bold().FontSize(14).FontColor(Colors.Green.Medium);
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
                    AddEmissionTable(innerColumn, "Transport Emissions", "Fuel Type", _transportData.Select(x => (x.FuelType, x.Emission)));
                    AddEmissionTable(innerColumn, "Warehouse Emissions", "Energy Type", _warehouseData.Select(x => (x.EnergyType, x.Emission)));
                    AddEmissionTable(innerColumn, "Packaging Emissions", "Packaging Type", _packagingData.Select(x => (x.PackagingType, x.Emission)));
                    AddEmissionTable(innerColumn, "Waste Emissions", "Waste Type", _wasteData.Select(x => (x.WasteType, x.Emission)));
                    AddEmissionTable(innerColumn, "Energy Emissions", "Energy Type", _energyData.Select(x => (x.EnergyType, x.Emission)));
                    AddEmissionTable(innerColumn, "Printing Emissions", "Print Type", _printingData.Select(x => (x.PrintType, x.Emission)));
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
