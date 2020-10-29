import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import '../css/charts.css';
import Plot from 'react-plotly.js';
import Loader from 'react-loader-spinner';


class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 0) {
                document.getElementById('scr1').style.display = 'none';
                document.getElementById('scr2').style.display = 'none';
                var el = document.getElementById('scr3');
                if (el)
                    el.style.display = 'none';
            }
        });
    }

    render() {
        var per_hundred = this.props.data;
        var type_chart = this.props.chart_type;
        console.log(per_hundred)
        var location = [], time = [], temp = [];
        location = per_hundred.map(item => item.device_display_name.toString().bold());
        temp = per_hundred.map(item => item.reading);
        time = per_hundred.map(item => item.time);

        //data-set removal if user removes certain data fields
        if (this.props.removal_data.length > 0 && per_hundred.length > 0) {
            var ar = [], c = 0;
            for (var i = 0; i < per_hundred.length; i++) {
                var flag = 0;
                for (var j = 0; j < this.props.removal_data.length; j++) {
                    if (per_hundred[i]) {
                        if (per_hundred[i].device_display_name == (this.props.removal_data)[j])
                            flag++;
                    }

                }
                if (flag == 0)
                    ar[c++] = per_hundred[i];
            }

            var location = [], time = [], temp = [], c = 0;;
            if (ar != []) {
                for (var i = 0; i < ar.length; i++) {
                    if (ar[i])
                        location[c++] = ar[i].device_display_name;
                }
                c = 0;
                for (var i = 0; i < ar.length; i++) {
                    if (ar[i])
                        temp[c++] = ar[i].reading;
                }
                c = 0;
                for (var i = 0; i < ar.length; i++) {
                    if (ar[i])
                        time[c++] = ar[i].time;
                }
            }

        }

        return (
            <div>

                <div >
                    <div style={{ width: '100%', background: 'black', paddingBottom: '25px', paddingTop: '5px' }}>
                        <Typography id='heading_dash' style={{ marginLeft: window.innerWidth > 768 ? '40%' : '15%', color: 'white', marginTop: '25px', fontSize: window.innerWidth > 768 ? '35px' : '17px' }}>Welcome to ioT Dashboard</Typography>
                    </div>
                    {
                        location.length > 0 == false &&
                        <div style={{ bottom: '40%', left: '45%', position: 'fixed' }}> <Loader type='Grid' color='dullgrey' height={70} width={70} timeout={7000} /></div>
                    }
                    {
                        this.props.status_check && location.length > 0 &&
                        <div id='scr1' style={{ bottom: window.innerWidth > 768 ? '80%' : '82%', left: window.innerWidth > 768 ? '40%' : '8%', position: 'fixed', zIndex: window.innerWidth > 768 ? '20' : '1', fontSize: window.innerWidth > 768 ? '20px' : '18px', fontWeight: '600', fontFamily: 'Helvetica', color: 'black', backgroundColor: '#dcdcdc', padding: '5px', borderRadius: '5px' }}>{(this.props.bucket)}&nbsp;&nbsp;items fetched every&nbsp;&nbsp;{Number(this.props.freq) / 1000}&nbsp;&nbsp;seconds.</div>
                    }
                    {
                        this.props.status_check && location.length > 0 &&
                        <div id='scr2' style={{ bottom: window.innerWidth > 768 ? '75%' : '78%', left: window.innerWidth > 768 ? '45%' : '35%', position: 'fixed', zIndex: window.innerWidth > 768 ? '20' : '1', fontSize: '17px', fontWeight: '300', fontFamily: 'Helvetica', color: 'white', backgroundColor: 'green', padding: '3px', borderRadius: '5px' }}>Live data Plotting</div>
                    }
                    {
                        !this.props.status_check && location.length > 0 &&
                        <div id='scr3' style={{ bottom: window.innerWidth > 768 ? '75%' : '78%', left: '45%', position: 'fixed', zIndex: window.innerWidth > 768 ? '20' : '1', fontSize: '17px', fontWeight: '300', fontFamily: 'Helvetica', color: 'white', backgroundColor: '#ad1b02', padding: '3px', borderRadius: '5px' }}>Live data Plotting - OFF</div>
                    }
                    <div id='back_image' style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', justifyContent: 'space-evenly', width: '100%', height: '100%', alignContent: 'center' }}>

                        {
                            type_chart == 'bar' && per_hundred.length > 0 &&
                            < div id='back_image1' style={{ padding: '10px', width: '100%', marginTop: window.innerWidth > 768 ? '7%' : '15%', textAlign: 'center' }}>
                                <Plot
                                    data={[
                                        { type: 'bar', x: location, y: time, marker: { color: '#e88d14' } },
                                    ]}
                                    layout={{ width: window.innerWidth > 768 ? '100%' : 320, height: window.innerWidth > 768 ? '100%' : 320, title: window.innerWidth > 768 ? 'Device_display_name'.bold() + ' vs ' + 'Time Plot'.bold() + ' - Bar Chart' : 'Device vs Time'.bold() }}
                                />
                            </div>
                        }
                        {
                            type_chart == 'scatter' && per_hundred.length > 0 &&
                            < div id='back_image1' style={{ padding: window.innerWidth > 768 ? '10px' : '2px', width: '100%', marginTop: window.innerWidth > 768 ? '7%' : '15%', textAlign: 'center' }}>
                                <Plot
                                    data={[
                                        {
                                            type: 'scatter', x: location, y: time, mode: 'lines+markers',
                                            marker: { color: '#e88d14' },
                                        },
                                    ]}
                                    layout={{ width: window.innerWidth > 768 ? '100%' : 320, height: window.innerWidth > 768 ? '100%' : 320, title: window.innerWidth > 768 ? 'Device_display_name'.bold() + ' vs ' + 'Time Plot'.bold() + ' - Scatter Chart' : 'Device vs Time'.bold() }}
                                />
                            </div>
                        }
                        {
                            type_chart == 'bar' && per_hundred.length > 0 &&
                            < div id='back_image2' style={{ padding: '10px', width: '100%', marginTop: window.innerWidth > 768 ? '7%' : '15%', textAlign: 'center' }}>
                                <Plot
                                    data={[
                                        { type: 'bar', x: location, y: temp, marker: { color: '#e88d14' } },
                                    ]}
                                    layout={{ width: window.innerWidth > 768 ? '100%' : 320, height: window.innerWidth > 768 ? '100%' : 320, title: window.innerWidth > 768 ? 'Device_display_name'.bold() + ' vs ' + 'Temperature Plot'.bold() + ' - Bar Chart' : 'Device vs temp'.bold() }}
                                />
                            </div>
                        }
                        {
                            type_chart == 'scatter' && per_hundred.length > 0 &&
                            < div id='back_image2' style={{ padding: '10px', width: '100%', marginTop: window.innerWidth > 768 ? '7%' : '15%', textAlign: 'center' }}>
                                <Plot
                                    data={[
                                        {
                                            type: 'scatter', x: location, y: temp, mode: 'lines+markers',
                                            marker: { color: '#e88d14' },
                                        },
                                    ]}
                                    layout={{ width: window.innerWidth > 768 ? '100%' : 320, height: window.innerWidth > 768 ? '100%' : 320, title: window.innerWidth > 768 ? 'Device_display_name'.bold() + ' vs ' + 'Temperature Plot'.bold() + ' - Scatter Chart' : 'Device vs temp'.bold() }}
                                />
                            </div>
                        }
                    </div>

                </div>
            </div >
        )

    }
}

export default Charts;