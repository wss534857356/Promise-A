export function PromiseA(callback) {
  var self = this;
  self.__state = 'Pending';
  var fulfill = function(params) {
    self.__state = 'Fulfilled';
    if (self.__fulfilled) {
      setTimeout(function() {
        self.__fulfilled.forEach((onFulfilled, index) => {
          delete self.__fulfilled[index];
          onFulfilled(params);
        });
      }, 0);
    }
    self.__params = params;
  };
  self.__fulfill = fulfill;
  var reject = function(error) {
    self.__state = 'Rejected';
    if (self.__rejected) {
      setTimeout(function() {
        self.__rejected.forEach((onFulfilled, index) => {
          delete self.__rejected[index];

          onFulfilled(error);
        });
      }, 0);
    }
    self.__reason = error;
  };
  self.__reject = reject;

  callback(fulfill, reject);
}

PromiseA.prototype.then = function(onFulfilled, onRejected) {
  var self = this;
  return new PromiseA(function(thenPromiseeFulfill, thenPromiseeReject) {
    var thenable;
    var fulfilled = function(fulfill) {
      if (fulfill && fulfill.then) {
        thenable = fulfill.then;
        if (typeof thenable === 'function') {
          fulfill.then(
            function(fulfill) {
              thenPromiseeFulfill(onFulfilled(fulfill));
            },
            function(error) {
              thenPromiseeReject(onRejected(error));
            }
          );
        }
      } else {
        if (typeof onFulfilled === 'function') {
          thenPromiseeFulfill(onFulfilled(fulfill));
        }
      }
    };
    if (!self.__fulfilled) {
      self.__fulfilled = [];
    }
    self.__fulfilled.push(fulfilled);
    var rejected = function(error) {
      if (typeof onRejected === 'function') {
        thenPromiseeReject(onRejected(error));
      } else {
        this.__reject(this.__reason);
      }
    };

    if (!self.__rejected) {
      self.__rejected = [];
    }
    self.__rejected.push(rejected);

    if (self.__state !== 'Pending') {
      if (self.__state === 'Fulfilled') {
        self.__fulfill(self.__params);
      } else {
        self.__reject(self.__reason);
      }
    }
  });
};

PromiseA.resolve = function(params) {
  return new PromiseA(function(fulfill) {
    fulfill(params);
  });
};

PromiseA.reject = function(reason) {
  return new PromiseA(function(fulfill, reject) {
    reject(reason);
  });
};
