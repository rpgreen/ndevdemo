import {Component} from "react";
import React from "react";

class LikeButton extends Component {
    render() {
        return (
            <button onClick={this.handleOnClick} className="btn btn-secondary">👍</button>
        );
    }

    handleOnClick() {
        // push the event to the kinesis stream
        let kinesis = window.kinesis;
        let AWS = window.AWS;
        let streamName = window.streamName;

        var params = {
            Data: JSON.stringify({
                user: AWS.config.credentials.identityId,
                time: new Date()
            }),
            PartitionKey: 'partition-' + AWS.config.credentials.identityId,
            StreamName: streamName
        };
        kinesis.putRecord(params, function(err, data) {
            if (err) console.log(err, err.stack);
        });
    }

}

export default LikeButton