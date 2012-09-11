# jaiks.js

**jaiks.js** is a javascript helper class.

The goal is to reduce the number of ajax requests needed to build a page.

This is done by *bundeling* requests into one request, for a server side handler, which distributes the sub requests, gathers data and returns it to **jaiks.js**.

**jaiks.js** will then send the response to callbacks which then processes the response object(s).

## Dependency

**jaiks.js** depends on [jQuery](http://jquery.com/) - tested with v1.8.1

## Usage
See example folder for a code example.

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
    <script src="/jaiks/jaiks.min.js"></script>
    <script>
    jaiks.init({'url': 'path/to/ajax/server'});

    function callBack (response) {
      console.log(response);
    }

    jaiks.add('some/internal/path', callBack, 10);
    jaiks.add('some/other/internal/path', callBack, 8);
    jaiks.exec();
    </script>

## Options

    {
        'url' : '',            // url to the ajax server
        'async' : true,        // toggle async mode for the request, default is true
        'post_var' : 'payload' // name of the postvariable that will hold the json formattet request
    }

## The server

The server request for the sample above would look like this (as a POST):

    payload=[{"weight":8,"action":"some/other/internal/path"},{"weight":10,"action":"some/internal/path"}]

**jaiks.js** then expects to get the same data and structure returned as a response (without the payload variable that is).
You can append any data you wish to the object, but the action property must be intact for **jaiks.js** to know where to send the response for this request.

A response example could be:

    [{"weight":8, "action":"some/internam/path", "data": "some rand() data"}, ...]

