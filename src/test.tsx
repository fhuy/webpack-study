import $ from 'jquery';
import moment from 'moment';

import './test.css';

console.log($);
moment.locale('zh-cn');
let time = moment().endOf('day').fromNow();
console.log(time);
