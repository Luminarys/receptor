import numeral from "numeral";

// via https://stackoverflow.com/a/46946490
const ssplit = str => str.match(/\\?.|^$/g).reduce((p, c) => {
    if (c === '"') {
        p.quote ^= 1;
    } else if (!p.quote && c === ' ') {
        p.a.push('');
    } else {
        p.a[p.a.length-1] += c.replace(/\\(.)/,"$1");
    }
    return p;
}, {a: ['']}).a;

export default function search_criteria(text) {
  if (!text) {
    return [];
  }
  const terms = ssplit(text);
  const operators = [":", "==", "!=", ">", ">=", "<", "<="];
  return terms.map(t => operators.reduce((a, op) => {
      if (t.indexOf(op) === -1) {
        return a;
      }
      const [field, value] = t.split(op);
      if (op == ":") {
        return { op: "ilike", field, value: `%${t}%` };
      }
      if (!isNaN(numeral(value).value())) {
        return {
          op,
          field,
          value: numeral(value).value()
        };
      }
      return { op, field, value };
    }, null) || {
      field: "name",
      op: "ilike",
      value: `%${t}%`
    }
  );
}
