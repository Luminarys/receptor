import numeral from "numeral";
import query from 'query-string';
import { filter_subscribe } from './actions/filter_subscribe';
import { push_query } from './actions/routing';

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

export function search_criteria(text) {
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

export function search_qs(text) {
  const qs = query.stringify({
    ...query.parse(location.search),
    s: text || undefined
  });
  return `${
    location.pathname === "/" ? location.pathname : ""
  }${qs && "?" + qs}`;
}

export function update_filter(text, fs, location, dispatch) {
  // there will always be one torrent filter
  const tfilter = fs.filter(fs => fs.kind === "torrent")[0];
  const criteria = search_criteria(text);
  dispatch(filter_subscribe("torrent", criteria, tfilter.serial));
  dispatch(push_query(search_qs(text)));
}
