package utils

import (
	"wetBulb/api"

	"github.com/go-echarts/go-echarts/v2/charts"
	"github.com/go-echarts/go-echarts/v2/opts"
	"github.com/go-echarts/go-echarts/v2/types"
)

func generateLineItems(slice []float64) []opts.LineData {
	items := make([]opts.LineData, 0)

	// for _, item := range slice {
	// 	items = append(items, opts.LineData{Value: item})
	// }
	for i := 0; i < 24; i++ {
		items = append(items, opts.LineData{Value: slice[i]})
	}
	return items

}

func GenerateLineChart(forecast api.OpenMeteoResponse) *charts.Line {
	// create a new line instance
	line := charts.NewLine()
	// set some global options like Title/Legend/ToolTip or anything else
	line.SetGlobalOptions(
		charts.WithInitializationOpts(opts.Initialization{Theme: types.ThemeWesteros}),
		charts.WithTitleOpts(opts.Title{
			Title:    "Forecast",
			Subtitle: "wet bulb temp above 35C are dangerous",
		}))

	// Put data into instance
	line.SetXAxis(forecast.Hourly.Time[0:24]).
		AddSeries("Temp °C", generateLineItems(forecast.Hourly.Temperature2M)).
		// AddSeries("Relative Humidity", generateLineItems(forecast.Hourly.Relativehumidity2M)).
		AddSeries("wet Bulb Temp °C", generateLineItems(forecast.Hourly.WetBulb2M)).
		SetSeriesOptions(charts.WithLineChartOpts(opts.LineChart{Smooth: true}))

	return line

}
