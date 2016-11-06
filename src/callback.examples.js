suite( "Callback examples" );

test( "Nesting serial async dependencies", done => {

    getCurrentCity( function( error, city ) {
        getWeather( city, function( error, weather ) {
            console.log( "weather", weather );
            done();
        } );

        console.log( `Weather for ${city}:` );
    } );

} );

test( "Verbose, hard to reuse, easy to forget, additional error handling mechanism", done => {

    getCurrentCity( function( error, city ) {
        if ( error ) {
            done( error );
            return;
        }

        getWeather( null, function( error, weather ) {
            console.log( "weather", weather );
        } );

        console.log( `Weather for ${city}:` );

        done();

    } );

} );

test( "Seams rip across program", done => {
    let _city;

    getCurrentCity( ( error, city ) => _city = city );

    getWeather( _city, function( error, city ) {
        if ( error ) {
            done( error );
            return;
        }
    } );

    done();

} );

test( "Results aren't easily reused", done => {

    getCurrentCity( ( error, city ) => {
        getWeather( city, ( error, weather ) => {
            console.log( weather );
        } );
    } );

    getCurrentCity( ( error, city ) => {
        getForecast( city, ( error, forecast ) => {
            console.log( forecast );
            done();
        } );
    } );

} );

test( "Parallel result synchronization", done => {

    const city = "NYC";

    let weatherData;
    let forecastData;

    getWeather( city, function( error, weather ) {
        weatherData = weather;

        console.log( "weather", weather );

        finishIfReady();
    } );

    getForecast( city, function( error, forecast ) {
        forecastData = forecast;

        console.log( "forecast", forecast );

        finishIfReady();
    } );

    function finishIfReady() {
        if ( weatherData && forecastData ) {
            console.log( "both done!" );

            done();

            return;
        }
        console.log( "not done yet" );
    }

} );

test( "Combined serial async dependencies and parallel result synchronization, with error handling", done => {

    getCurrentCity( function( error, city ) {
        if ( error ) {
            return done( error );
        }

        let weatherData;
        let forecastData;

        getWeather( city, function( error, weather ) {
            if ( error ) {
                return done( error );
            }

            weatherData = weather;

            console.log( "weather", weather );

            finishIfReady();
        } );

        getForecast( city, function( error, forecast ) {
            if ( error ) {
                return done( error );
            }

            forecastData = forecast;

            console.log( "forecast", forecast );

            finishIfReady();
        } );

        function finishIfReady() {
            if ( weatherData && forecastData ) {
                console.log( "both done!" );

                done();

                return;
            }
            console.log( "not done yet" );
        }

        console.log( `Weather for ${city}:` );
    } );

} );
