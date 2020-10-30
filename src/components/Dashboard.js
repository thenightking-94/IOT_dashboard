import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import Charts from './Charts';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TuneIcon from '@material-ui/icons/Tune';
import { Grid } from '@material-ui/core';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false,
            is_cycle: false,
            remainder_array: [],
            hundred_el: [],
            pos: 0,
            elapse: 5000,
            per_slot: 25,
            plot_type: 'scatter',
            data_reset: 'Stop',
            cut_data: false,
            live_status: true,
            removal: false,
            removal_items: [],
            pointer: false
        };
    }

    componentDidMount() {
        fetch("/Zenatix.json", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json.data
                });
            });

        //window.addEventListener('resize', () => { document.location.reload(); })
    }


    cal = () => {
        //data chunking in data bucket
        var { items, pos } = this.state;
        var decoy = this.state.remainder_array.length ? this.state.remainder_array : items;
        //per hundred/fifty/twenty-five elements elements 
        if (decoy.length >= 100) {
            var ar = [], c = 0, res = 0;
            for (var i = pos == 0 ? 0 : pos; i < items.length; i++) {
                ar[i] = items[i];
                c++;
                if (c == this.state.per_slot) {
                    res = i;
                    this.setState({ pos: i });
                    break;
                }
            }

            this.setState({ remainder_array: items.slice(res + 1, items.length) });
            this.setState({ hundred_el: ar });

        }

    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }
    componentDidUpdate() {
        var { items, is_cycle } = this.state;
        if (items && !is_cycle && this.state.elapse) {
            if (this.timer)//clearing previous timers if any
                clearInterval(this.timer);
            this.timer = setInterval(this.cal, this.state.elapse);
            this.setState({ is_cycle: true });
        }


        if (this.state.remainder_array.length < 25)
            this.setState({ remainder_array: items });

        //obtaining removal data fields from checkboxes
        if (this.state.removal && this.state.hundred_el) {
            var el = document.querySelectorAll("input[id='check_box']");
            if (el) {
                var ar = [];
                for (var i = 0; i < el.length; i++) {
                    if (el[i].checked == true)
                        ar.push(el[i].value);
                }
            }
            this.setState({ removal_items: ar, removal: false });
        }

    }

    //controlling live-feed timers
    live_feed = (str) => {
        if (str == 'Stop' && this.timer) { clearInterval(this.timer); this.setState({ is_cycle: true, live_status: false }); }
        if (str == 'Start') {
            this.setState({ is_cycle: false, live_status: true });
        }
    }

    //resetting the data fields
    clearence = () => {
        this.setState({ removal_items: [] });
        var el = document.querySelectorAll("input[id='check_box']");
        if (el) {
            var ar = [];
            for (var i = 0; i < el.length; i++) {
                if (el[i].checked == true)
                    el[i].checked = false;
            }
        }

    }


    render() {
        const { isLoaded, items } = this.state;
        var ar = [];
        ar = items.map(item => item.device_display_name);
        var non_dup = new Set(ar);//removing duplicate device_display_names using Set constructor
        non_dup = [...non_dup];
        // console.log(non_dup)


        if (!isLoaded) {
            return (
                <div style={{ top: '45%', left: '45%', position: 'fixed' }}>
                    <Loader type='Bars' color='#e88d14' height={70} width={70} timeout={5000} />
                </div>
            )
        }

        else if (isLoaded) {
            return (
                <div onClick={() => {
                    if (window.innerWidth < 768 && this.state.pointer == true) {
                        document.getElementById('data_cust').style.left = '-42px';
                        document.getElementById('data_cust').style.transition = '0.8s';
                        document.getElementById('data_cust').style.width = '0px';
                        this.setState({ pointer: false });
                    }
                }}>
                    <div id='data_cust' onMouseLeave={() => {
                        document.getElementById('data_cust').style.left = '-42px';
                        document.getElementById('data_cust').style.transition = '0.8s';
                        document.getElementById('data_cust').style.width = '0px';
                    }} style={{
                        left: '-42px', top: '0px', position: 'fixed', width: '0px', height: '100%', background: 'black', opacity: '1', padding: '20px', zIndex: '15'
                    }}>
                        <p style={{ borderRadius: '5px', textAlign: 'center', marginTop: '15px', fontSize: '20px', fontWeight: '600', fontFamily: 'Helvetica', color: 'white', overflow: 'hidden', backgroundColor: '#e88d14' }}>Check boxes to remove particular data-sets </p>
                        <br />
                        <Grid container spacing={24} style={{ overflow: 'hidden' }}>
                            {non_dup.map(item =>
                                <Grid key={item} item md={6} sm={6} style={{ display: 'flex' }}>
                                    <input type='checkbox' value={item} id='check_box' />&nbsp;&nbsp;&nbsp;<p style={{ fontSize: '14px', color: '#e88d14', fontWeight: '600', fontFamily: 'Helvetica' }}>{item}</p>
                                    <br /><br />
                                </Grid>
                            )}
                        </Grid>
                        {window.innerWidth > 768 && <br />}
                        {
                            this.state.removal_items.length == 0 &&
                            <p onClick={() => { this.setState({ removal: true }) }} style={{ cursor: 'pointer', borderRadius: '5px', textAlign: 'center', padding: '8px', marginTop: '15px', fontSize: '17px', fontWeight: '600', fontFamily: 'Helvetica', color: 'white', overflow: 'hidden', backgroundColor: 'red' }}>Remove data fields</p>
                        }
                        {
                            this.state.removal_items.length > 0 &&
                            <p onClick={() => { this.clearence() }} style={{ cursor: 'pointer', borderRadius: '5px', textAlign: 'center', padding: '8px', marginTop: '15px', fontSize: '17px', fontWeight: '600', fontFamily: 'Helvetica', color: 'white', overflow: 'hidden', backgroundColor: '#fe3b08' }}>Reset data fields</p>
                        }


                    </div>
                    <div style={{ width: '100%', background: 'white', overflowX: 'hidden' }}>

                        <div style={{
                            right: '20px', top: window.innerWidth > 768 ? '34px' : '20px', position: 'fixed', zIndex: '10'
                        }} >
                            <p onClick={() => {
                                document.getElementById('widget_custo').style.right = '0px';
                                document.getElementById('widget_custo').style.transition = '0.8s';
                                if (window.innerWidth > 768)
                                    document.getElementById('widget_custo').style.width = '450px';
                                else
                                    document.getElementById('widget_custo').style.width = '80%';

                            }} title='click for options' style={{ background: 'black', padding: '5px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#e88d14', fontSize: '22px', fontFamily: 'Helvetica' }} ><TuneIcon fontSize='large' /></p>
                        </div>

                        <div id='widget_custo' style={{
                            right: '-42px', top: '0px', position: 'fixed', width: '0px', height: '100%', background: '#dcdcdc', opacity: '1', padding: '20px', zIndex: '15'
                        }}>
                            <p onClick={() => {
                                document.getElementById('widget_custo').style.right = '-42px';
                                document.getElementById('widget_custo').style.transition = '0.8s';
                                document.getElementById('widget_custo').style.width = '0px';
                            }} title='click to close' style={{ float: 'left', width: '25px', textAlign: 'center', cursor: 'pointer', color: 'white', fontSize: '25px', fontFamily: 'Helvetica', backgroundColor: 'black', borderRadius: '10px' }}>x</p>

                            <div style={{ marginLeft: '10px', marginRight: '10px', marginTop: '40px', marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
                                <FormControl style={{ marginTop: '40px', width: '80%' }}>
                                    <InputLabel style={{ fontSize: '30px', fontFamily: 'Helvetica', color: '#e88d14', fontWeight: '600' }} id="demo-customized-select-label">Select Data Bucket :</InputLabel>
                                    <br />
                                    <Select
                                        style={{ marginTop: '25px' }}
                                        labelId="demo-customized-select-label"
                                        id="demo-customized-select"
                                        value={this.state.per_slot}
                                        onChange={(e) => { this.setState({ per_slot: e.target.value }) }}

                                    >
                                        <MenuItem value={100}>Hundred Items</MenuItem>
                                        <MenuItem value={50}>Fifty Items</MenuItem>
                                        <MenuItem value={25}>Twenty-five Items</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl style={{ marginTop: '40px', width: '80%' }}>
                                    <InputLabel style={{ fontSize: '30px', fontFamily: 'Helvetica', color: '#e88d14', fontWeight: '600', whiteSpace: 'nowrap' }} id="demo-customized-select-label">Select Data-Refresh interval :</InputLabel>
                                    <br />
                                    <Select
                                        style={{ marginTop: '25px' }}
                                        labelId="demo-customized-select-label"
                                        id="demo-customized-select"
                                        value={this.state.elapse}
                                        onChange={(e) => { this.setState({ elapse: e.target.value, is_cycle: false }) }}

                                    >

                                        <MenuItem value={15000}>Fifteen seconds</MenuItem>
                                        <MenuItem value={10000}>Ten seconds</MenuItem>
                                        <MenuItem value={5000}>Five seconds</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl style={{ marginTop: '40px', width: '80%' }}>
                                    <InputLabel style={{ fontSize: '30px', fontFamily: 'Helvetica', color: '#e88d14', fontWeight: '600', whiteSpace: 'nowrap' }} id="demo-customized-select-label">Select to Change Live-feed options :</InputLabel>
                                    <br />
                                    <Select
                                        style={{ marginTop: '25px' }}
                                        labelId="demo-customized-select-label"
                                        id="demo-customized-select"
                                        value={this.state.data_reset}
                                        onChange={(e) => { this.setState({ data_reset: e.target.value }); this.live_feed(e.target.value); }}

                                    >
                                        <MenuItem value={'Stop'}>Stop live feed</MenuItem>
                                        <MenuItem value={'Start'}>Start live feed</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl style={{ marginTop: '40px', width: '80%' }}>
                                    <InputLabel style={{ fontSize: '30px', fontFamily: 'Helvetica', color: '#e88d14', fontWeight: '600', whiteSpace: 'nowrap' }} id="demo-customized-select-label">Select Chart-type :</InputLabel>
                                    <br />
                                    <Select
                                        style={{ marginTop: '25px' }}
                                        labelId="demo-customized-select-label"
                                        id="demo-customized-select"
                                        value={this.state.plot_type}
                                        onChange={(e) => { this.setState({ plot_type: e.target.value }) }}

                                    >
                                        <MenuItem value={'scatter'}>Scatter</MenuItem>
                                        <MenuItem value={'bar'}>Bar</MenuItem>
                                    </Select>
                                </FormControl>

                                <p onClick={() => {

                                    document.getElementById('data_cust').style.left = '0px';
                                    document.getElementById('data_cust').style.transition = '0.8s';
                                    if (window.innerWidth > 768)
                                        document.getElementById('data_cust').style.width = '490px';
                                    else {
                                        this.setState({ pointer: true });
                                        document.getElementById('data_cust').style.width = '80%';
                                    }

                                    //closing the right side bar also
                                    document.getElementById('widget_custo').style.right = '-42px';
                                    document.getElementById('widget_custo').style.transition = '0.8s';
                                    document.getElementById('widget_custo').style.width = '0px';
                                }} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '60px', fontSize: '19px', fontFamily: 'Helvetica', color: '#e88d14', fontWeight: '600', whiteSpace: 'nowrap', background: 'black', padding: '5px', borderRadius: '5px' }}>Click to Customise Data-set</p>

                            </div>


                        </div>


                        {
                            this.state.hundred_el && this.state.remainder_array &&
                            <Charts data={this.state.hundred_el} removal_data={this.state.removal_items} bucket={this.state.per_slot} freq={this.state.elapse} chart_type={this.state.plot_type} sort_check={this.state.sort_check_data} status_check={this.state.live_status} />
                        }
                        <div style={{ width: '100%', bottom: '0px', position: window.innerWidth > 768 ? 'fixed' : 'relative', background: 'black', textAlign: 'center', fontFamily: 'Helvetica', color: 'white', paddingTop: '15px', paddingBottom: '15px' }}>Copyright @ Zenatix Solutions</div>
                    </div>
                </div >
            )
        }
    }
}

export default Dashboard;