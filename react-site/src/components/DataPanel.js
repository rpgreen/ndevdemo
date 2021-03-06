import {Component} from "react";
import React from "react";

const refreshPeriod = 2000;

class DataPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            error: null,
            items: []
        };
    }

    render() {
        return (
            <div>
                <table className="table table-striped">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">User</th>
                        <th scope="col">Time</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.state.items.map(item => {
                            return (
                                    <tr key={item.User + item.Time}>
                                        <td>
                                            {item.User}
                                        </td>
                                        <td>
                                            {item.Time}
                                        </td>
                                    </tr>
                                )
                        })}
                    </tbody>
                </table>

            </div>
        );
    }

    updateState() {
        this.setState({isLoading: true});

        let path = window.apiPath + '/likes';

        fetch(path)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .then(data => {
                if (data === null) {
                    data = [];
                }
                this.setState({items: data, isLoading: false});
            })
            .catch(error => this.setState({error: error, isLoading: false}));
    }

    componentDidMount() {
        this.interval = setInterval(() => this.updateState(), refreshPeriod);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

}

export default DataPanel