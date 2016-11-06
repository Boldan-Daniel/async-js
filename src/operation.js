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
    let operation = {
        successReaction: [],
        errorReaction: []
    };

    getCurrentCity( function( error, result ) {
        if ( error ) {
            operation.errorReaction.forEach( reaction => reaction( error ) );
            return;
        }

        operation.successReaction.forEach( reaction => reaction( result ) );
    } );

    operation.onCompletion = ( onSuccess, onError ) => {
        const noop = () => {};

        operation.successReaction.push( onSuccess || noop );
        operation.errorReaction.push( onError );
    };

    operation.onFailure = onError => {
        operation.onCompletion( null, onError );
    };

    return operation;
}

function fetchWeather( city ) {
    let operation = {
        successReaction: [],
        errorReaction: []
    };

    getWeather( city, function( error, result ) {
        if ( error ) {
            operation.errorReaction.forEach( reaction => reaction( error ) );
            return;
        }

        operation.successReaction.forEach( reaction => reaction( result ) );
    } );

    operation.onCompletion = ( onSuccess, onError ) => {
        const noop = () => {};

        operation.successReaction.push( onSuccess || noop );
        operation.errorReaction.push( onError || noop );
    };

    operation.onFailure = onError => {
        operation.onCompletion( null, onError );
    };

    return operation;
}

test( "noop if no success handler passed", done => {
    let operation = fetchCurrentCity();

    operation.onFailure( error => done( error ) );
    operation.onCompletion( result => done() );
} );

test( "noop if no error handler passed", done => {
    let operation = fetchWeather();

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
