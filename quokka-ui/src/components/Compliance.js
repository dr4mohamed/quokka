import React, {Component} from 'react';
import Button from '@material-ui/core/Button'
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import 'typeface-roboto'
import Backdrop from "@material-ui/core/Backdrop";
import TableHead from "@material-ui/core/TableHead";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {green, red} from "@material-ui/core/colors";
import CancelIcon from "@material-ui/icons/Cancel";

class Compliance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            devices: {devices: []},
            isLoading: false,
            dashboard: props.dashboard,
        };
    }

    fetchCompliance() {

        this.setState({isLoading: true});
        let requestUrl = 'http://127.0.0.1:5000/devices'
        fetch(requestUrl)
            .then(res => res.json())
            .then((data) => {
                this.setState({devices: data, isLoading: false})
                console.log(this.state.devices)
            })
            .catch(console.log)
    }

    componentDidMount() {
        this.fetchCompliance(false)
        this.interval = setInterval(() => this.fetchCompliance(), 300000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    renderDashboardFacts(deviceName) {
        this.state.dashboard.setState({deviceName: deviceName, show: "facts"})
    }

    render() {

        const {devices, isLoading} = this.state;

        return (
            <div className="container">
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <h2>Compliance Table</h2>
                    {isLoading ?
                        <Backdrop open={true}>
                            <CircularProgress color="inherit"/>
                        </Backdrop>
                        : ""}
                    <Button variant="contained" onClick={() => {
                        this.fetchCompliance()
                    }}>Refresh Compliance</Button>
                </Grid>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Status</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Vendor : OS</TableCell>
                            <TableCell>IP Address</TableCell>
                            <TableCell align="center">OS</TableCell>
                            <TableCell align="center">Config</TableCell>
                            <TableCell>Last Checked</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {devices.devices.map((device) => (
                            <TableRow key={device.name}>
                                <TableCell align="center">{device.availability ?
                                    <CheckCircleIcon style={{color: green[500]}}/>
                                    : <CancelIcon  style={{color: red[500]}}/>
                                }</TableCell>
                                <TableCell onClick={() => this.renderDashboardFacts(device.name)}
                                           style={{cursor: 'pointer'}}>{device.name}</TableCell>
                                <TableCell>{device.vendor} : {device.os}</TableCell>
                                <TableCell>{device.ip_address}</TableCell>
                                <TableCell align="center">{device.os_compliance ?
                                    <CheckCircleIcon style={{color: green[500]}}/>
                                    : <CancelIcon  style={{color: red[500]}}/>
                                }</TableCell>
                                <TableCell align="center">{device.config_compliance ?
                                    <CheckCircleIcon style={{color: green[500]}}/>
                                    : <CancelIcon  style={{color: red[500]}}/>
                                }</TableCell>
                                <TableCell>{device.last_compliance_check}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default Compliance;