function Iterator() {

    this.completed = false;
    this.current = undefined;

    this.iterateFunction = function () {
        return false;
    };

    this.resetFunction = function () {
    };

    this.moveNext = function(){
        if (this.completed) {
            return false;
        }

        this.current = undefined;
        return this.iterateFunction();
    };

    this.reset = function () {
        this.completed = false;
        this.resetFunction();
    };
};