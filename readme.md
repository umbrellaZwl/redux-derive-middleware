# derive middleware

* 用于从指定的action，在满足一定条件下，衍生出一个新的action，从而达到针对一定条件下的扎堆action在reducer中进行统一处理，而不用对每一个action都进行判断

### 举例
截取当下常见的redux-promise-middle和type-to-reducer的组合
```js
export default typeToReducer(
  {
    [GET_LIST]: {
      [pending]: state => state.set('getList', true),
      [fulfilled]: state => state.set('getList', false),
      [rejected]: state => state.set('getList', false)
    }
  },
  initialState
);
```
这里代码比较简化，但是可以看到有很多这样的场景里对一个异步请求的pending状态和非pending状态都需要体现在页面的动态更新上，因此每一个请求都对应了pending、fulfilled、rejected三个不同的处理。
使用deriveMiddleware，派发统一的action，标记该actionType的isFetching的值，这样便可以在全局的reducer来处理了，如下：
```js
const GLOBAL_ASYNC_TYPE = 'gloal_async_type';
const deriveWare = deriveMiddleware(action => {
  const reg1 = new RegExp(`${typeDelimiter}${promiseTypeSuffixes.pending}$`);
  const reg2 = new RegExp(`${typeDelimiter}${promiseTypeSuffixes.fulfilled}$`);
  const reg3 = new RegExp(`${typeDelimiter}${promiseTypeSuffixes.rejected}$`);
  const actionType = action.type;
  if (reg1.test(actionType)) {
    return {
      ...action,
      actionType: actionType.replace(reg1, ''),
      type: GLOBAL_ASYNC_TYPE,
      isFetching: true
    };
  } else if (reg2.test(actionType) || reg3.test(actionType)) {
    return {
      ...action,
      actionType: actionType.replace(reg2, '').replace(reg3, ''),
      type: GLOBAL_ASYNC_TYPE,
      isFetching: false
    };
  }
});


function appReducer(state = initialState, action) {
  switch (action.type) {
    case GLOBAL_ASYNC_TYPE:
      let { actionType, isFetching } = action;
      return state.set(actionType, isFetching);
    default:
      return state;
  }
}
```
