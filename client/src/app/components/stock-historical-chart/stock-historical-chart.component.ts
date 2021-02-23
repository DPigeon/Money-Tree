import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { EChartsOption, graphic } from 'echarts';

export interface ChartViewOptions {
  view: string;
  range: string;
  interval: string;
}
@Component({
  selector: 'app-stock-historical-chart',
  templateUrl: './stock-historical-chart.component.html',
  styleUrls: ['./stock-historical-chart.component.scss'],
})
export class StockHistoricalChartComponent implements OnInit, OnChanges {
  @Input() historicalData: any;
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
    { view: '1 year', range: '1y', interval: '1wk' },
    { view: '5 years', range: '5y', interval: '1mo' },
    { view: 'max', range: 'max', interval: '3mo' },
  ];
  selectedRange = '1d';

  async ngOnInit(): Promise<void> {
    await this.formatChartData();
    this.displayChart();
  }
  async ngOnChanges(): Promise<void> {
    await this.formatChartData();
    this.displayChart();
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
          name: 'Price (USD)',
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
        },
      ],
    };
  }

  formatChartData(): void {
    this.xAxisData = this.convertTimeStampToDate(
      this.historicalData.chart.result[0].timestamp
    );
    this.yAxisData = this.formatValues(
      this.historicalData.chart.result[0].indicators.quote[0].close
    );
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
      const hour = conversionTime.getHours();
      const min = conversionTime.getMinutes();
      const sec = conversionTime.getSeconds();

      switch (this.selectedRange) {
        case '1d':
        case '5d':
        case '1mo':
          xAxis.push(String(month + ' ' + date + '\n ' + hour + ':' + min));
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
    const formattedValues: number[] = [];
    values.forEach((v) => {
      formattedValues.push(Number(v.toFixed(2)));
      if (this.minValue > v) {
        this.minValue = Math.floor(v);
      }
      if (this.maxValue < v) {
        this.maxValue = Math.ceil(v);
      }
    });
    this.intervalValue = Math.ceil((this.maxValue - this.minValue) / 12);
    if ((this.maxValue - this.minValue) / 12 < 0.5) {
      this.maxValue += 1;
    } else {
      this.maxValue = this.minValue + this.intervalValue * 12;
    }
    this.minValue = this.minValue - this.intervalValue;

    return formattedValues;
  }
}
