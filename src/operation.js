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
    let operation = {};

    getCurrentCity( function( error, result ) {
        if ( error ) {
            operation.onError( error );
            return;
        }

        operation.onSuccess( result );
    } );

    operation.setCallbacks = ( onSuccess, onError ) => {
        operation.onSuccess = onSuccess;
        operation.onError   = onError;
    };

    return operation;
}


test( "fetchCurrentCity pass the callback later on", done => {
    let operation = fetchCurrentCity();

    operation.setCallbacks(
        result => done(),
        error  => done( error )
    );
} );
