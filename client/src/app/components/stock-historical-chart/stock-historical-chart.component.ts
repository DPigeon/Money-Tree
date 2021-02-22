import { Component,OnChanges,Input, OnInit } from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { Stock } from 'src/app/interfaces/stock';

@Component({
  selector: 'app-stock-historical-chart',
  templateUrl: './stock-historical-chart.component.html',
  styleUrls: ['./stock-historical-chart.component.scss'],
})
export class StockHistoricalChartComponent implements OnInit {
// @Input() :Stock; 
@Input() historicalData: any;
chartOption: EChartsOption;

constructer(){}

ngOnInit(): void {
  

     this.chartOption= {
      // title: {
      //     text: '堆叠区域图'
      // },
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
      },
      // legend: {
      //     data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      // },
      // toolbox: {
      //     feature: {
      //         saveAsImage: {}
      //     }
      // },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: [
          {
              type: 'category',
              boundaryGap: false,
              data: this.chartx
          }
      ],
      yAxis: [
          {
              type: 'value'
          }
      ],
      series: [
          {
              name: 'close',
              type: 'line',
              stack: 'u',
              areaStyle: {
                opacity: 0.8,
                color: new graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(128, 255, 165)'
                }, {
                    offset: 1,
                    color: 'rgba(1, 191, 236)'
                }])
            },
              emphasis: {
                  focus: 'series'
              },
              data: this.charty
          },
          
         
      ]
  };
}
get chartx(): any {
  return this.convertTimeStampToDate(this.stockHistoricalData.chart.result[0].timestamp); 
}
get charty(): any {
  return this.stockHistoricalData.chart.result[0].indicators.quote[0].close; 
}
convertTimeStampToDate(time:any[]): string[]{
    let xAxis: string[] =[]
 time.forEach(t => {
    var a = new Date(t * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    
   
// Will display time in 10:30:23 format
xAxis.push(String(date + ' ' + month + ' ' + year ));

 });
return xAxis;
}
}
