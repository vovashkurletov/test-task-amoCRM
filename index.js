const request = require('request');
var express = require('express');

var app = express();

var genAnswerJson = []

app.get('/api/leads', function(req, res) {
    var answerJson = {}
    var arrOfNames = []

    let access_token = 'Bearer xxxx';
    var options = {
        url: 'https://subdomain.amocrm.ru/api/v4/leads?with=contacts&query=',
        headers: {
            'Authorization': access_token,
        }
    };

    var urlAdd = '';
    if (req.query.query != undefined) {
        options.url = options.url + req.query.query //console.log(urlAdd);
    }
    console.log(options);

    function callback1(error, response, body) {
        //console.log(req.query, response.statusCode);
        if (!error && response.statusCode == 200) {

            const info = JSON.parse(body);
            let infoel = info['_embedded']['leads'];
            let ans = '';

            function callback2(error, response, body, nm) {
                if (!error && response.statusCode == 200) {
                    let info = JSON.parse(body);
                    answerJson[arrOfNames.pop()] = {
                        'name': info.name,
                        [info['custom_fields_values'][0].field_code]: info['custom_fields_values'][0].values[0].value,
                        [info['custom_fields_values'][1].field_code]: info['custom_fields_values'][1].values[0].value
                    };
                    console.log(arrOfNames)
                }

                //console.log(456)
            }
            for (var attr in infoel) {
                arrOfNames[attr] = infoel[attr].name;
            }
            console.log(arrOfNames)

            for (var attr in infoel) {
                ans = infoel[attr]['_embedded']['contacts'][0]['_links']['self']['href'] + "\n"; //получаем urlы контактов
                options.url = ans;


                answerJson[arrOfNames[attr]] = {};
                request(options, callback2, arrOfNames[0]);
            }




        }
    }

    request(options, callback1);
    //console.log(123)
    setTimeout(() => {
        res.send(answerJson)
    }, 1000) //жесткий костыль, извиняюсь :_(

})




var server = app.listen(3000, function() {
    var host = 'localhost'
    var port = server.address().port

    console.log("Example app listening at //%s:%s", host, port)
})
