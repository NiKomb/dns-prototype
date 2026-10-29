import * as data from './data.js';
import {mountJournal} from '../../shared/journal/views.js';
mountJournal(document.body,{initial:data});
