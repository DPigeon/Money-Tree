import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { StockHistory } from 'src/app/interfaces/stockHistory';

export interface ChartViewOptions {
  view: string;
  range: string;
  interval: string;
}
@Component({
  selector: 'app-historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrls: ['./historical-chart.component.scss'],
})
export class HistoricalChartComponent implements OnInit, OnChanges {
  @Input() historicalData: StockHistory;
  @Output() changeHistoricalChartRangeInterval = new EventEmitter<{
    range: string;
    interval: string;
  }>();

  chartOption: EChartsOption;
  minValue = 0;
  maxValue = 0;
  intervalValue = 1;
  xAxisData: string[] = [];
  yAxisData: number[] = [];
  chartOptions = [
    { view: '1 day', range: '1d', interval: '5m' },
    { view: '5 days', range: '5d', interval: '15m' },
    { view: '1 month', range: '1mo', interval: '1h' },
    { view: '6 months', range: '6mo', interval: '1d' },
    { view: '1 year', range: '1y', interval: '5d' },
    { view: '5 years', range: '5y', interval: '1mo' },
    { view: 'max', range: 'max', interval: '3mo' },
  ];
  selectedRange = '1d';
  currentStock = '';
  isUnavailableChart = false;

  async ngOnInit(): Promise<void> {
    if (
      this.historicalData &&
      this.historicalData.closePrice.filter((h) => h !== null).length > 1
    ) {
      await this.formatChartData();
      this.displayChart();
      this.isUnavailableChart = false;
    } else {
      this.isUnavailableChart = true;
    }
  }
  async ngOnChanges(): Promise<void> {
    if (this.historicalData) {
      if (this.currentStock !== this.historicalData.symbol) {
        this.selectedRange = '1d';
        this.currentStock = this.historicalData.symbol;
      }
      if (this.historicalData.closePrice.filter((h) => h !== null).length > 1) {
        await this.formatChartData();
        this.displayChart();
        this.isUnavailableChart = false;
      } else {
        this.isUnavailableChart = true;
      }
    }
  }

  displayChart(): void {
    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },

      grid: {
        left: '2%',
        right: '2%',
        bottom: '2%',
        top: '5%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          interval: this.intervalValue,
          min: this.minValue,
          max: this.maxValue,
        },
      ],
      series: [
        {
          name: 'Price (' + this.historicalData.currency + ')',
          type: 'line',
          stack: 'u',
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(7, 54, 124, 100)',
              },
              {
                offset: 1,
                color: 'rgba(1, 191, 236, 0)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: this.yAxisData,
          connectNulls: true,
        },
      ],
    };
  }

  async formatChartData(): Promise<void> {
    this.xAxisData = this.convertTimeStampToDate(this.historicalData.timestamp);
    this.yAxisData = this.formatValues(this.historicalData.closePrice);
  }

  convertTimeStampToDate(time: any[]): string[] {
    const xAxis: string[] = [];
    let conversionTime: Date;
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    time.forEach((t) => {
      conversionTime = new Date(t * 1000);
      const year = conversionTime.getFullYear();
      const month = months[conversionTime.getMonth()];
      const date = conversionTime.getDate();
      const hour = String(conversionTime.getHours());
      const min = String(conversionTime.getMinutes());

      switch (this.selectedRange) {
        case '1d':
        case '5d':
        case '1mo':
          xAxis.push(
            String(
              month +
                ' ' +
                date +
                '\n ' +
                hour.padStart(2, '0') +
                ':' +
                min.padStart(2, '0')
            )
          );
          break;
        case '6mo':
        case '1y':
        case '5y':
        case 'max':
          xAxis.push(String(month + ' ' + date + '\n ' + year));
          break;
      }
    });

    return xAxis;
  }

  changeRangeInterval(option: ChartViewOptions): void {
    this.selectedRange = option.range;
    this.changeHistoricalChartRangeInterval.emit({
      range: option.range,
      interval: option.interval,
    });
  }

  getOptionClass(option: string): string {
    if (this.selectedRange === option) {
      return 'range-option-selected';
    }
    return 'range-option';
  }

  formatValues(values: number[]): number[] {
    this.minValue = values[0];
    this.maxValue = values[0];

    const formattedValues = values.map((v) =>
      v == null ? null : Number(v.toFixed(2))
    );
    this.minValue = Math.floor(
      Math.min(...formattedValues.filter((f) => f !== null))
    );
    this.maxValue = Math.ceil(
      Math.max(...formattedValues.filter((f) => f !== null))
    );
    this.intervalValue = Math.ceil((this.maxValue - this.minValue) / 12);
    return formattedValues;
  }
}
