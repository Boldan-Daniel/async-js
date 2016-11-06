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

    operation.setCallbacks = ( onSuccess, onError ) => {
        operation.successReaction.push( onSuccess );
        operation.errorReaction.push( onError );
    };

    return operation;
}

test( "pass multiple callbacks - all of them are called", done => {
    let operation = fetchCurrentCity();

    const multiDone = callDone( done ).afterTwoCalls();

    operation.setCallbacks( result => multiDone() );
    operation.setCallbacks( result => multiDone() );
} );

test( "fetchCurrentCity pass the callback later on", done => {
    let operation = fetchCurrentCity();

    operation.setCallbacks(
        result => done(),
        error  => done( error )
    );
} );
