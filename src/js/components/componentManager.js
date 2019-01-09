
const getAttribute = (first, second) => {
  if (first === '') {
    return `data-${second}`;
  }
  return `data-${first}-${second}`;
};

export function setAttributesConfig(element, obj = {}, attrs, start = '') {
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      let keyStart = key;
      if (start !== '') {
        keyStart = `${start}-${key}`;
      }

      setAttributesConfig(element, obj[key], attrs, keyStart);
      return;
    }

    const attr = getAttribute(start, key);
    element.setAttribute(attr, obj[key]);
  });
}

export function getAttributesConfig(element, obj = {}, attrs, start = '') {
  // copy object
  const newObj = Object.assign({}, obj);
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (obj[key] !== null && obj[key].constructor === Object) {
      let keyStart = key;
      if (start !== '') {
        keyStart = `${start}-${key}`;
      }

      newObj[key] = getAttributesConfig(element, obj[key], attrs, keyStart);
      return;
    }

    // update value
    let value = obj[key]; // default value
    const type = typeof value;
    const attr = getAttribute(start, key);
    const attrValue = element.getAttribute(attr);

    if (attrValue !== null) {
      if (type === 'boolean') {
        // convert string to boolean
        value = attrValue === 'true';
      } else if (/^-{0,1}\d+$/.test(attrValue)) {
        value = parseInt(attrValue, 10);
      } else {
        value = attrValue;
      }
    }

    newObj[key] = value;
  });

  return newObj;
}

if (!Array.isArray(document.componentStack)) {
  document.componentStack = [];
}

export default {
  add(component) {
    document.componentStack.push(component);
  },
  remove(component) {
    const index = document.componentStack.findIndex(c => Object.is(component, c));
    if (index > -1) {
      document.componentStack.splice(index, 1);
    }
  },
  closable(component) {
    return document.componentStack.length === 0 || Object.is(document.componentStack[document.componentStack.length - 1], component);
  },
};
