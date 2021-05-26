const app = require('./server');

app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

const path = require('path');