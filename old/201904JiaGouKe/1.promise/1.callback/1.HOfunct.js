// 高阶函数 回调函数 将一个函数传入到另一个函数中，在这个函数内部会调用此函数 ， 一个函数返回一个函数
// 高阶函数 要不参数是函数 或者 返回值是一个函数
// AOP 面向切片编程 把代码二次封装不破坏原有的逻辑 插入自己的逻辑
// 装饰模式
Function.prototype.before = function(fn){
    let that = this;
    return function(){
        fn();
        that.apply(null,arguments); // apply主要是用来传递参数的
    }
}
function say(a,b){
    console.log('say~~~',a,b)
}
let newSay = say.before(function(){ // 在原有的逻辑之前执行
    console.log('您好');
});
newSay(1,2);
// bind 绑定参数  bind实现原理 预置参数
