suite( "Mocha with QUnit interface and expect (separate library) assertions - examples" );

test( "Passing test", () => {
    expect( true ).toBe( true );
} );

test( "Throw, expected", () => {

    expect( function() {

        throw new Error( "oh noes" );

    } ).toThrow( "oh noes" );

} );

test( "Synchronous throw, uncaught", () => {

    throw new Error( "oh noes" );

} );

test( "Async throw, uncaught", () => {

    setTimeout( function() {

        throw new Error( "oh noes" );

    }, 1 );

} );


test( "Synchronous assert, is an uncaught error", () => {

    expect( true ).toBe( false );

} );

test( "Async assert, is an uncaught error too!", () => {

    setTimeout( function() {

        expect( true ).toBe( false );

    }, 1 );

} );

