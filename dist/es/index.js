import isPlainObject from './utils/isPlainObject';

export default function createDerive(deriveFrom) {
  return function (store) {
    return function (next) {
      return function (action) {
        if (typeof deriveFrom !== 'function') {
          console.warn('Expected the deriveFrom to be a function.');
          return next(action);
        }

        var newAction = deriveFrom(action);
        if (!newAction) {
          return next(action);
        }
        if (!isPlainObject(newAction)) {
          console.warn('the Action make by deriveFrom must be plain objects. ');
        } else if (typeof action.type === 'undefined') {
          console.warn('Actions may not have an undefined "type" property. ');
        } else {
          next(newAction);
        }
        return next(action);
      };
    };
  };
}