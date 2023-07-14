  
import {Lexer,Parser} from './index'
const input1 = 'SELECT col1, col2 FROM table WHERE col1 = 10 AND col2 > 20;';
const lexer1 = new Lexer(input1);
const tokens = lexer1.tokenize();
const parser1 = new Parser(tokens);
const ast = parser1.parse();
console.log(JSON.stringify(ast, null, 2));