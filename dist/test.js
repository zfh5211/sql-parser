"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var input1 = 'SELECT col1, col2 FROM table WHERE col1 = 10 AND col2 > 20;';
var lexer1 = new index_1.Lexer(input1);
var tokens = lexer1.tokenize();
var parser1 = new index_1.Parser(tokens);
var ast = parser1.parse();
console.log(JSON.stringify(ast, null, 2));
