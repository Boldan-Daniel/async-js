const delayms = 1;

function getCurrentCity( callback ) {
    setTimeout( function(  ) {

        const city = "New York, NY";
        callback( null, city );

    }, delayms );
}

function getWeather( city, callback ) {
    setTimeout( function(  ) {

        if ( !city ) {
            callback( new Error( "City required to get weather" ) );
            return;
        }

        const weather = {
            temp: 50
        };

        callback( null, weather );

    }, delayms );
}

function getForecast( city, callback ) {
    setTimeout( function(  ) {

        if ( !city ) {
            callback( new Error( "City required to get forecast" ) );
            return;
        }

        const fiveDay = {
            fiveDay: [ 60, 70, 80, 45, 50 ]
        };

        callback( null, fiveDay );

    }, delayms );
}

suite.only( "operations" );

function fetchCurrentCity() {
    let operation = new Operation();

    getCurrentCity( operation.nodeCallback );

    return operation;
}

function fetchWeather( city ) {
    let operation = new Operation();

    getWeather( city, operation.nodeCallback );

    return operation;
}

function fetchForecast( city ) {
    let operation = new Operation();

    getForecast( city, operation.nodeCallback );

    return operation;
}

function Operation() {
    let operation = {
        successReaction: [],
        errorReaction: []
    };

    operation.succed = ( result ) => {
        operation.state = "succeded";
        operation.successReaction.forEach( reaction => reaction( result ) );
        operation.result = result;
    };

    operation.fail = ( error ) => {
        operation.state = "failed";
        operation.errorReaction.forEach( reaction => reaction( error ) );
        operation.error = error;
    };

    operation.onCompletion = ( onSuccess, onError ) => {
        const noop = () => {};

        if ( operation.state === "succeded" ) {
            onSuccess( operation.result );
        } else if ( operation.state === "failed" ) {
            onError( operation.error );
        } else {
            operation.successReaction.push( onSuccess || noop );
            operation.errorReaction.push( onError || noop );
        }

        return new Operation();
    };

    operation.onFailure = onError => {
        return operation.onCompletion( null, onError );
    };

    operation.nodeCallback = ( error, result ) => {
        if ( error ) {
            operation.fail( error );
            return;
        }

        operation.succed( result );
    };

    operation.forwardCompletion = ( op => {
        operation.onCompletion( op.succed, op.fail );
    } );

    return operation;
}

function doLater( func ) {
    setTimeout( func, 1 );
}

test ( "life is full of async, nesting is inevitable, let's do something about it", done => {
    let weatherOp = fetchCurrentCity().onCompletion( city => {
        fetchWeather( city ).forwardCompletion( weatherOp );
    } );

    weatherOp.onCompletion( weather => done() );
} );

test( "lexical parallelism", done => {
    const city = "Cluj";
    const weatherOp = fetchWeather( city );
    const forecastOp = fetchForecast( city );

    weatherOp.onCompletion( weather => {
        forecastOp.onCompletion( forecast => {
            console.log( `It's currently ${weather.temp} in ${city} with a five day forecast of ${forecast.fiveDay}` );
            done();
        } );
    } );
} );

test( "register error calback async", done => {
    var operationThatErrors = fetchWeather();

    doLater( function() {
        operationThatErrors.onFailure( () => done() );
    } );
} );

test( "register success calback async", done => {
    var operationThatSucceds = fetchCurrentCity();

    doLater( function() {
        operationThatSucceds.onCompletion( city => done() );
    } );
} );

test( "noop if no success handler passed", done => {
    let operation = fetchCurrentCity();

    operation.onFailure( error => done( error ) );
    operation.onCompletion( result => done() );
} );

test( "noop if no error handler passed for weather", done => {
    let operation = fetchWeather();

    operation.onCompletion( result => done( new Error( "shouldn't succed" ) ) );
    operation.onFailure( error => done() );
} );

test( "noop if no error handler passed for forecast", done => {
    let operation = fetchForecast();

    operation.onCompletion( result => done( new Error( "shouldn't succed" ) ) );
    operation.onFailure( error => done() );
} );

test( "pass multiple callbacks - all of them are called", done => {
    let operation = fetchCurrentCity();

    const multiDone = callDone( done ).afterTwoCalls();

    operation.onCompletion( result => multiDone() );
    operation.onCompletion( result => multiDone() );
} );

test( "fetchCurrentCity pass the callback later on", done => {
    let operation = fetchCurrentCity();

    operation.onCompletion(
        result => done(),
        error  => done( error )
    );
} );
