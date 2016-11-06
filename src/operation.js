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
        operation.successReaction.forEach( reaction => reaction( result ) );
    };

    operation.fail = ( error ) => {
        operation.errorReaction.forEach( reaction => reaction( error ) );
    };

    operation.onCompletion = ( onSuccess, onError ) => {
        const noop = () => {};

        operation.successReaction.push( onSuccess || noop );
        operation.errorReaction.push( onError || noop );
    };

    operation.onFailure = onError => {
        operation.onCompletion( null, onError );
    };

    operation.nodeCallback = ( error, result ) => {
        if ( error ) {
            operation.fail( error );
            return;
        }

        operation.succed( result );
    };

    return operation;
}

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
