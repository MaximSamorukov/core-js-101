/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return new proto.constructor(...Object.values(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  element(value) {
    if (this.root && this.root.includes('element')) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.root) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const { ...ob } = { ...this };
    ob.str = ob.str ? `${ob.str}${value}` : `${value}`;
    ob.elemen = value;
    ob.root += ' element';
    ob.stringify = () => ['elemen'].reduce((acc, i) => {
      if (!ob[i]) {
        return acc;
      }
      return acc + ob[i];
    }, '');
    return { ...ob };
  },

  id(value) {
    if (this.root && this.root.includes('id')) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.root && (this.root.includes('class') || this.root.includes('pseudo-element'))) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const { ...ob } = { ...this };
    ob.str = ob.str ? `${ob.str}#${value}` : `#${value}`;
    ob.root += ' id';
    ob.idd = `#${value}`;
    ob.stringify = () => ['elemen', 'idd'].reduce((acc, i) => {
      if (!ob[i]) {
        return acc;
      }
      return acc + ob[i];
    }, '');
    return { ...ob };
  },

  class(value) {
    if (this.root && this.root.includes('attr')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const { ...ob } = { ...this };
    ob.str = ob.str ? `${ob.str}.${value}` : `.${value}`;
    ob.root += ' class';
    ob.clas = ob.clas ? `${ob.clas}.${value}` : `.${value}`;
    ob.stringify = () => ['elemen', 'idd', 'clas', 'attrr', 'pseudoCl', 'pseudoEl'].reduce((acc, i) => {
      if (!ob[i]) {
        return acc;
      }
      return acc + ob[i];
    }, '');
    return { ...ob };
  },

  attr(value) {
    if (this.root && this.root.includes('pseudo-class')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const { ...ob } = { ...this };
    ob.str = ob.str ? `${ob.str}[${value}]` : `[${value}]`;
    ob.attrr = ob.attrr ? `${ob.attrr}[${value}]` : `[${value}]`;
    ob.root += ' attr';
    ob.stringify = () => ['elemen', 'idd', 'clas', 'attrr', 'pseudoCl', 'pseudoEl'].reduce((acc, i) => {
      if (!ob[i]) {
        return acc;
      }
      return acc + ob[i];
    }, '');
    return { ...ob };
  },

  pseudoClass(value) {
    if (this.root && this.root.includes('pseudo-element')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const { ...ob } = { ...this };
    ob.str = ob.str ? `${ob.str}:${value}` : `:${value}`;
    ob.pseudoCl = ob.pseudoCl ? `${ob.pseudoCl}:${value}` : `:${value}`;
    ob.root += ' pseudo-class';
    ob.stringify = () => ['elemen', 'idd', 'clas', 'attrr', 'pseudoCl', 'pseudoEl'].reduce((acc, i) => {
      if (!ob[i]) {
        return acc;
      }
      return acc + ob[i];
    }, '');
    return { ...ob };
  },

  pseudoElement(value) {
    if (this.root && this.root.includes('pseudo-element')) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const { ...ob } = { ...this };
    ob.str = ob.str ? `${ob.str}::${value}` : `::${value}`;
    ob.root += ' pseudo-element';
    ob.pseudoEl = `::${value}`;
    ob.stringify = () => ['elemen', 'idd', 'clas', 'attrr', 'pseudoCl', 'pseudoEl'].reduce((acc, i) => {
      if (!ob[i]) {
        return acc;
      }
      return acc + ob[i];
    }, '');
    return { ...ob };
  },

  combine(selector1, combinator, selector2) {
    const { ...ob } = { ...this };
    ob.str = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    ob.stringify = () => ob.str;
    return { ...ob };
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
