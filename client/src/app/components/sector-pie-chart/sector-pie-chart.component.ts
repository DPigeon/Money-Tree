import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { User, UserProfile } from 'src/app/interfaces/user';

export interface SectorChart {
  value: number;
  name: string;
}
@Component({
  selector: 'app-sector-pie-chart',
  templateUrl: './sector-pie-chart.component.html',
  styleUrls: ['./sector-pie-chart.component.scss'],
})
export class SectorsPieChartComponent implements OnInit, OnChanges {
  @Input() currentProfileUser: UserProfile;
  @Input() user: User;
  percentile = 0;

  chartOption: EChartsOption;
  axisData: SectorChart[] = [];
  isUnavailableChart = false;

  async ngOnInit(): Promise<void> {
    if (
      this.currentProfileUser &&
      this.currentProfileUser.transactions.length > 0
    ) {
      this.percentile = this.currentProfileUser.percentile;
      await this.formatChartData();
      this.displayChart();
      this.isUnavailableChart = false;
    } else {
      this.isUnavailableChart = true;
    }
  }
  async ngOnChanges(): Promise<void> {
    if (this.currentProfileUser) {
      if (this.currentProfileUser.transactions.length > 1) {
        this.percentile = this.currentProfileUser.percentile;
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
        trigger: 'item',
        formatter: '{a} <br/>{b}: {d}%',
      },

      legend: {
        show: false,
      },
      series: [
        {
          name: 'Percentage',
          type: 'pie',
          radius: '50%',
          top: '-15%',
          height: '350px',

          data: this.axisData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  async formatChartData(): Promise<void> {
    this.axisData = this.formatData(this.currentProfileUser);
  }

  formatData(data: UserProfile): SectorChart[] {
    const res: SectorChart[] = [];
    data.transactions.forEach((t) => {
      if (t.industry !== null && t.industry !== '') {
        const index = res.findIndex((i) => i.name === t.industry);
        if (index === -1) {
          res.push({ value: 1, name: t.industry });
        } else {
          const val = res[index].value;
          const n = res[index].name;
          res[index] = { value: val + 1, name: n };
        }
      }
    });
    return res;
  }
  getPercentile(): string {
    return '(Top ' + Math.round(this.percentile) + '%)';
  }
}
