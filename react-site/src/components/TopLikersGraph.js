import {Component} from "react";
import React from "react";

var BarChart = require("react-chartjs").Bar;
var Chart = require("chart.js");

class TopLikersGraph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            error: null,
            data: {
                Counts : {}
            }
        };
    }

    render() {
        var chartOptions = {}

        var chartData = {
            labels: Object.keys(this.state.data.Counts),
            datasets: [
                {
                    fillColor: Chart.defaults.segmentColorDefault,
                    backgroundColor: Chart.defaults.segmentColorDefault,
                    strokeColor: Chart.defaults.segmentColorDefault,
                    highlightFill: Chart.defaults.segmentHighlightColorDefaults,
                    highlightStroke: Chart.defaults.segmentColorDefault,
                    data: Object.values(this.state.data.Counts)
                }
            ]
        };

        console.log("Chart data " + JSON.stringify(chartData))
        const isLoading = this.state.isLoading;

        return (
                    <div>
                        {!isLoading ? (
                            <div className="chart">
                                <i>Graph generated at {this.state.data.Time}</i>
                                <BarChart data={chartData} options={chartOptions} width="800" height="600"/>
                            </div>) : (
                                <img src="./loading.gif"/>
                            )
                        }
                    </div>
        );
    }

    updateState() {
        this.setState({isLoading: true});

        let path = window.apiPath + '/toplikers';

        fetch(path)
            .then(response => {
                console.log(response);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .then(data => {
                this.setState({data: data, isLoading: false});
            })
            .catch(error => this.setState({error: error, isLoading: false}));
    }

    componentDidMount() {
        this.interval = setInterval(() => this.updateState(), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

}

export default TopLikersGraph