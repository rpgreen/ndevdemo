'use strict'

// note: these should be injected at build time from CloudFormation parameters
AWS.config.region = 'us-east-1';
var streamName = 'LikesStream'
var shardId = 'shardId-000000000000'
var userPoolId = 'us-east-1_ujqGXdUzY'
var clientId = 'gbknfl2plil90b14rflvmo10'
var identityPoolId = 'us-east-1:b7df71c5-f146-4b63-9ebf-dbf945e7b7ec'
var apiPath = "https://63c81wbg6k.execute-api.us-east-1.amazonaws.com/Prod"
var kinesis = {};
var shardIterator = {};

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
});
AWS.config.credentials.get(function(err) {
    // attach event listener
    if (err) {
        alert('Error retrieving credentials.');
        console.error(err);
        return;
    }
    // create kinesis service object
    kinesis = new AWS.Kinesis({
        apiVersion: '2013-12-02'
    });

    // initialize stream iterator
    var params = {
      ShardId: shardId,
      ShardIteratorType: 'LATEST',
      StreamName: streamName
    };
    kinesis.getShardIterator(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        shardIterator = data.ShardIterator;
      }
    });

    // get current user
    var data = {
        UserPoolId : userPoolId,
        ClientId : clientId
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }
            console.log('session validity: ' + session.isValid());
            alert(JSON.stringify(cognitoUser));
        });
    }
});

// poll for new likes
var interval = setInterval(getLikes, 1000);

function putLike() {
    var params = {
        Data: JSON.stringify({
                    user: AWS.config.credentials.identityId,
                    time: new Date()
                }),
        PartitionKey: 'partition-' + AWS.config.credentials.identityId,
        StreamName: streamName
    };
    kinesis.putRecord(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
}


function getLikes() {
    if (shardIterator === null) { return; }

    var params = {
      ShardIterator: shardIterator, /* required */
      Limit: 100
    };
    kinesis.getRecords(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        //console.log(JSON.stringify(data))

        data.Records.forEach(function(record) {
            var bytes = record.Data;
            var decoded = String.fromCharCode.apply(null, bytes);
            //console.log(decoded);
            document.getElementById('likes-panel').insertAdjacentHTML('beforeend', decoded);

            shardIterator = data.NextShardIterator;
        });
      }
    });
}

const e = React.createElement;
class LikeButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e(
            'button',
            { onClick: () => putLike() },
            'Like'
    );
    }
}

class ShowLikesDataButton extends React.Component {
    constructor(props) {
        super(props);
    }

    showLikesData() {
        fetch(apiPath + '/likes')
            .then(response => response.json())
            .then(data =>
                this.showData({ data }
            ));
    }

    showData(data) {
        // todo: make this more react-ish
        document.getElementById('likes-data').innerHTML = JSON.stringify(data);
    }

    render() {
        return e(
            'button',
            { onClick: () => this.showLikesData() },
            'Show Likes Data'
    );
    }
}

ReactDOM.render(e(LikeButton), document.querySelector('#like-button'));
ReactDOM.render(e(ShowLikesDataButton), document.querySelector('#show-likes-button'));