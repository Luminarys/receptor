import moment from 'moment';

export default function date(when) {
  return `${when.format("YYYY-MM-DD LTS")} (${when.from(moment())})`;
}
