import { PromiseA } from './PromiseA';

describe('测试基础方法', function() {
  it('调用 Promise.resolve', function(done) {
    var promise = PromiseA.resolve(42);
    promise.then(function(value) {
      expect(value).toEqual(42);
      done();
    });
  });

  it('调用 Promise.reject', function(done) {
    var promise = PromiseA.reject(1);
    promise.then(
      () => {},
      error => {
        expect(error).toEqual(1);
        done();
      }
    );
  });

  it('生成 Promise', function(done) {
    const promise = new PromiseA(resolve => {
      resolve('test');
    });
    promise.then(data => {
      expect(data).toEqual('test');
      done();
    });
  });
});

describe('测试 thenable', function() {
  it('测试 then function', function() {
    const promise = new PromiseA(resolve => {
      resolve({
        then: function(resolve) {
          resolve('thenable');
        },
      });
    });
    expect(promise).resolves.toBe('thenable');
  });

  it('传递 reject', function() {
    const promise = new PromiseA(resolve => {
      resolve(PromiseA.reject());
    });
    expect(promise).rejects.toThrow();
  });
});

describe('测试 catch', function() {
  it('测试 then 方法中的 catch 传递', function(done) {
    const promise = Promise.reject('error');
    promise
      .then()
      .then(
        () => {},
        error => {
          expect(error).toEqual('error');
          return 'catch error';
        }
      )
      .then(value => {
        expect(value).toEqual('catch error');
        done();
      });
  });
});
