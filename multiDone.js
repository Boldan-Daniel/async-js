function callDone( done ) {
    let counter = 0;

    return {
        afterNCalls: function( expectedCount ) {
            return function multiDone() {
                counter++;
                if ( counter >= expectedCount ) {
                    done();
                }
            };
        },
        afterTwoCalls: function() {
            return this.afterNCalls( 2 );
        }
    };
}
