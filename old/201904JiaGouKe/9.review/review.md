## review

#### 1 关于函数

- 什么是高阶函数?  

  把函数作为参数或者返回值的一类函数。

- AOP (装饰模式)

  AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，其实就是给原函数增加一层，不用管原函数内部实现

  ```javascript
  let arr = ['shift','push','unshift'];
  let proto = Object.create(Array.prototype);
  arr.forEach(method=>{
      proto[method] = function(){
          console.log('update');
          Array.prototype[method].call(this,...arguments);
      }
  })
  function fn(array){
      if(Array.isArray(array)){
          array.__proto__ = proto;
      }
  }
  ```

- 发布订阅模式 、 观察者模式 (events on emit)

  一种一对多的关系，发布者和订阅者是否有关联，观察者模式基于发布订阅模式

#### 2 promise

- promise 中的链式调用如何中断?

- Promise.finally实现原理?  Promise.resolve(()=>{}).then()

- promise有哪些缺点？fetch 无法中断，但是可以丢弃本次请求  依然是基于回调的方式，好处可以扁平化处理我们的逻辑，处理错误比较方便

  ```javascript
  function wrap(p1){
      let abort;
      let p2 = new Promise((resolve,reject)=>{
          abort = function(){
              reject('失败')
          }
      });
      let p =  Promise.race([p1,p2]);
      p.abort = abort;
      return p;
  }
  
  let p = wrap(new Promise((resolve,reject)=>{
      setTimeout(() => {
          resolve();  
      }, 3000);
  }))
  p.then(()=>{},()=>{console.log('失败')})
  p.abort();
  ```

- generator &  co   * yiled  function next(){}

- async + await  try catch 同步的写代码

#### 3 ES6

- let & const (1.没有变量提升 2.不会污染全局作用域 3.不能重复声明 4）拥有自己的作用域 let {} )  import 提升到当前代码的顶部

- Symbol 第六种基本数据类型  独一无二  11 种symbol的定义方式  元编程

- spread (… 解构赋值和剩余运算符 只能用在最后一个参数)  深拷贝 如何深拷贝一个对象

- set & map (weakMap)  去重 扁平化数组 并且去重 iterator  交集 并集  差集

- defineProperty proxy、reflect (数据劫持 代理)  enumerable(是否可枚举)  writable (仅读的属性)

- arrowfunc (没有this，没有arguments，没有原型)

- es6中的类 (类的继承（公有 实例上的属性），静态属性，静态方法（static），super关键字,装饰器的应用)

  mixin  类的混合 对象的混合Object.assign(Class.prototype,{a:1,b:2})

  ```javascript
  // 类中的this问题
  class MyClass {
      fn(){
          console.log(this); // undefined
      }
  }
  let myClass = new MyClass();
  let fn = myClass.fn;
  fn(); 
  ```

  ```javascript
  // 类中的mixnin
  let Mixin = (superClass) => class extends superClass{
      beforeCreate(){
          console.log('before create2');
          super.beforeCreate();
      }
    }
    class S {
      beforeCreate() {
        console.log('before create3');
      }
    }
    class C extends Mixin(S) {
      beforeCreate() {
        console.log('before create1');
        super.beforeCreate();
      }
    }
    new C().beforeCreate();
  ```

- reduce compose方法  map filter some every find findIndex

  ```javascript
  // 数组的flat
  let arr = [1, [2, [3, [4, [5, [6]]]]]];
  function flatten(arr) {
    return arr.reduce((prev, current) => {
      if (Array.isArray(current)) {
        return prev.concat(flatten(current));
      } else {
        prev.push(current);
      }
      return prev;
    }, []);
  }
  console.log(flatten(arr));
  ```

- ES6中的模块化( 静态导入/动态导入)

  

#### 4 宏任务微任务

- 微任务： promise.then ，MutationObserver，process.nextTick

- 宏任务：script ， setTimeout ，setInterval ，setImmediate （ie下），MessageChannel ，I/O ，UI rendering。

>  微任务 会比宏任务快，js中会先执行script脚本



#### 5 浏览器事件环和node事件环

v10+执行的效果是一样的。给每个宏任务对应的都配置了一个队列 timer poll check (每个执行完后清空一次微任务)

```javascript
const p =Promise.resolve();
;(()=>{
    const implicit_promise = new Promise(resolve =>{
        const promise = new Promise(res=>res(p)); 
        promise.then(()=>{ // after:wait
            console.log('after:await');
            resolve()
        })
    });
    return implicit_promise
})();
p.then(()=>{ 
    console.log('tick:a');
}).then(()=>{
    console.log('tick:b');
}).then(()=>{
    console.log('tick:c');
});
```



```javascript
async function async1(){
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2(){
    console.log('async2')
}
console.log('script start')
setTimeout(function(){
    console.log('setTimeout') 
},0)  
async1();
new Promise(function(resolve){
    console.log('promise1')
    resolve();
}).then(function(){
    console.log('promise2')
})
console.log('script end')
```

#### 进程和线程的区别 (node中的进程)

一个进程中可以有多个线程，比如渲染线程、JS 引擎线程、HTTP 请求线程等等

,进程表示一个程序，线程是进程中的单位  主线程只有一个 

1个进程可以占用1核cpu

- 多线程在单核cpu中其实也是顺序执行的，不过系统可以帮你切换那个执行而已，没有提高速度
- 多个cpu的话就可以在多个cpu中同时执行

> 单线程优点：解决切换上下文时间,锁的问题,节省内存

> node 主进程，在开多个子进程，里面包含着一个线程

#### node中的全局对象  (可以直接调用的)

- process，buffer
- process.cwd() 可以改变 process.nextTick process.pid **process.argv** commander **process.env** 环境变量
- require,exports,module,\_\_filename,\_\_dirname (可以直接在模块内部被访问)

#### node中的模块

- 模块分类 ES6module,commonjs规范 amd,cmd,umd
- commonjs规范  
  - 一个文件就是一个模块
  - 如果模块想给别人使用 module.exports  /  exports 同一个对象但是最终导出的是module.exports 
  - 如果想使用这个模块 require (同步读取文件，包一个自执行函数，vm.runInthisContext,传入export对象，最终返回的是exports 对象，所以就可以拿到其他模块的内容)
- 模块的查找规范
  	- 第三方模块 module.paths
  	- 如果文件和文件夹重名 先取文件，文件不能取到，找文件夹 package.json => main => index.js

#### npm 的应用

- 发布包，publish 版本管理  npx 可以执行脚本
- npm link 链接帮我们把这个包链接到当前系统的npm下载目录
- script脚本的配置，以及发布全局包 bin字段   #! /usr/bin/env node

#### Buffer的应用

- 创建buffer  三种 Buffer.alloc(3) Buffer.from([])  Buffer.from('字符串')
- Buffer.concat (Buffer.copy) Buffer.isBuffer() buf.toString()  indexOf slice()   封装了一个split方法
- base64 编码问题 (加密？解密 转码)  3 * 8 =  4 * 6 可以减少请求 所有的路径都可以用base64替换，比源文件大1/3

#### node的内置模块

- vm runInThisContext
- path  resolve 绝对路径 join __dirname 如果有/ 那就用join   extname base name dirname
- util util.inhertis util.promisify
- events on emit once off newListener
- fs readFile writeFile assess stat  (fs.open  fs.read  fs.write  fs.close)
- stat.isFile isDirectory unlink rename  mkdir rmdir …readdir