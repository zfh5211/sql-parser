"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Lexer = void 0;
var Lexer = /** @class */ (function () {
    function Lexer(input) {
        this.position = 0;
        this.currentChar = null;
        this.input = input;
        this.currentChar = this.input[this.position];
    }
    Lexer.prototype.advance = function () {
        this.position++;
        if (this.position > this.input.length - 1) {
            this.currentChar = null;
        }
        else {
            this.currentChar = this.input[this.position];
        }
    };
    Lexer.prototype.skipWhitespace = function () {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    };
    Lexer.prototype.isLetter = function (char) {
        return char !== null && /[a-zA-Z]/.test(char);
    };
    Lexer.prototype.isDigit = function (char) {
        return char !== null && /\d/.test(char);
    };
    Lexer.prototype.peek = function () {
        var peekPosition = this.position + 1;
        if (peekPosition > this.input.length - 1) {
            return null;
        }
        else {
            return this.input[peekPosition];
        }
    };
    Lexer.prototype.getIdentifer = function () {
        var result = '';
        while (this.currentChar !== null && (this.isLetter(this.currentChar) || this.isDigit(this.currentChar))) {
            result += this.currentChar;
            this.advance();
        }
        return result.toUpperCase();
    };
    Lexer.prototype.getNumber = function () {
        var result = '';
        while (this.currentChar !== null && this.isDigit(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        if (this.currentChar === '.') {
            result += this.currentChar;
            this.advance();
            while (this.currentChar !== null && this.isDigit(this.currentChar)) {
                result += this.currentChar;
                this.advance();
            }
        }
        return result;
    };
    Lexer.prototype.tokenize = function () {
        var token = this.getNextToken();
        var tokens = [];
        while (token) {
            tokens.push(token);
            token = this.getNextToken();
        }
        return tokens;
    };
    Lexer.prototype.getNextToken = function () {
        while (this.currentChar !== null) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }
            if (this.currentChar === ',') {
                this.advance();
                return { type: 'COMMA', value: ',' };
            }
            if (this.currentChar === ';') {
                this.advance();
                return { type: 'SEMI', value: ';' };
            }
            if (this.currentChar === '(') {
                this.advance();
                return { type: 'LEFT_PAREN', value: '(' };
            }
            if (this.currentChar === ')') {
                this.advance();
                return { type: 'RIGHT_PAREN', value: ')' };
            }
            if (this.currentChar === '*') {
                this.advance();
                return { type: 'ASTERISK', value: '*' };
            }
            if (this.currentChar === '+') {
                this.advance();
                return { type: 'PLUS', value: '+' };
            }
            if (this.currentChar === '-') {
                this.advance();
                return { type: 'MINUS', value: '-' };
            }
            if (this.currentChar === '*') {
                this.advance();
                return { type: 'MULTIPLY', value: '*' };
            }
            if (this.currentChar === '/') {
                this.advance();
                return { type: 'DIVIDE', value: '/' };
            }
            if (this.currentChar === '%') {
                this.advance();
                return { type: 'MODULO', value: '%' };
            }
            if (this.currentChar === '=') {
                if (this.peek() === '=') {
                    var value = '==';
                    this.advance();
                    this.advance();
                    return { type: 'EQUAL', value: value };
                }
                this.advance();
                return { type: 'EQUAL', value: '=' };
            }
            if (this.currentChar === '!') {
                if (this.peek() === '=') {
                    var value = '!=';
                    this.advance();
                    this.advance();
                    return { type: 'NOT_EQUAL', value: value };
                }
                throw new Error("Unexpected character: ".concat(this.currentChar));
            }
            if (this.currentChar === '<') {
                if (this.peek() === '=') {
                    var value = '<=';
                    this.advance();
                    this.advance();
                    return { type: 'LESS_EQUAL', value: value };
                }
                this.advance();
                return { type: 'LESS', value: '<' };
            }
            if (this.currentChar === '>') {
                if (this.peek() === '=') {
                    var value = '>=';
                    this.advance();
                    this.advance();
                    return { type: 'GREATER_EQUAL', value: value };
                }
                this.advance();
                return { type: 'GREATER', value: '>' };
            }
            if (this.isLetter(this.currentChar)) {
                var identifer = this.getIdentifer();
                if (identifer === 'SELECT') {
                    return { type: 'SELECT', value: 'SELECT' };
                }
                if (identifer === 'FROM') {
                    return { type: 'FROM', value: 'FROM' };
                }
                if (identifer === 'WHERE') {
                    return { type: 'WHERE', value: 'WHERE' };
                }
                return { type: 'IDENTIFIER', value: identifer };
            }
            if (this.isDigit(this.currentChar)) {
                return { type: 'NUMBER', value: this.getNumber() };
            }
            throw new Error("Unexpected character: ".concat(this.currentChar));
        }
        return null;
    };
    return Lexer;
}());
exports.Lexer = Lexer;
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this.currentIndex = 0;
        this.currentToken = null;
        this.tokens = tokens;
        this.currentToken = this.tokens[this.currentIndex];
    }
    Parser.prototype.eat = function (tokenType) {
        if (this.currentToken === null) {
            throw new Error("Unexpected end of input");
        }
        if (this.currentToken.type !== tokenType) {
            throw new Error("Unexpected token: ".concat(this.currentToken.type, ", expected: ").concat(tokenType));
        }
        this.currentIndex++;
        this.currentToken = this.tokens[this.currentIndex];
    };
    Parser.prototype.parsePrimaryExpression = function () {
        if (this.currentToken === null) {
            throw new Error("Unexpected end of input");
        }
        if (this.currentToken.type === 'IDENTIFIER') {
            var identifierNode = {
                type: 'IDENTIFIER',
                value: this.currentToken.value,
            };
            this.eat('IDENTIFIER');
            return identifierNode;
        }
        if (this.currentToken.type === 'NUMBER') {
            var numberNode = {
                type: 'NUMBER',
                value: Number(this.currentToken.value),
            };
            this.eat('NUMBER');
            return numberNode;
        }
        if (this.currentToken.type === 'LEFT_PAREN') {
            this.eat('LEFT_PAREN');
            var expressionNode = this.parseExpression();
            this.eat('RIGHT_PAREN');
            return expressionNode;
        }
        throw new Error("Unexpected token: ".concat(this.currentToken.type));
    };
    Parser.prototype.parseMultiplicativeExpression = function () {
        var leftNode = this.parsePrimaryExpression();
        while (this.currentToken && (this.currentToken.type === 'MULTIPLY' || this.currentToken.type === 'DIVIDE' || this.currentToken.type === 'MODULO')) {
            var operatorNode = {
                type: 'OPERATOR',
                value: this.currentToken.value,
            };
            this.eat(this.currentToken.type);
            var rightNode = this.parsePrimaryExpression();
            return {
                type: 'BINARY_EXPRESSION',
                operator: operatorNode,
                left: leftNode,
                right: rightNode,
            };
        }
        return leftNode;
    };
    Parser.prototype.parseAdditiveExpression = function () {
        var leftNode = this.parseMultiplicativeExpression();
        while (this.currentToken && (this.currentToken.type === 'PLUS' || this.currentToken.type === 'MINUS')) {
            var operatorNode = {
                type: 'OPERATOR',
                value: this.currentToken.value,
            };
            this.eat(this.currentToken.type);
            var rightNode = this.parseMultiplicativeExpression();
            leftNode = {
                type: 'BINARY_EXPRESSION',
                operator: operatorNode,
                left: leftNode,
                right: rightNode,
            };
        }
        return leftNode;
    };
    Parser.prototype.parseComparisonExpression = function () {
        var leftNode = this.parseAdditiveExpression();
        while (this.currentToken &&
            (this.currentToken.type === 'EQUAL' ||
                this.currentToken.type === 'NOT_EQUAL' ||
                this.currentToken.type === 'LESS_THAN' ||
                this.currentToken.type === 'LESS_THAN_OR_EQUAL' ||
                this.currentToken.type === 'GREATER_THAN' ||
                this.currentToken.type === 'GREATER_THAN_OR_EQUAL')) {
            var operatorNode = {
                type: 'OPERATOR',
                value: this.currentToken.value,
            };
            this.eat(this.currentToken.type);
            var rightNode = this.parseAdditiveExpression();
            leftNode = {
                type: 'BINARY_EXPRESSION',
                operator: operatorNode,
                left: leftNode,
                right: rightNode,
            };
        }
        return leftNode;
    };
    Parser.prototype.parseExpression = function () {
        return this.parseComparisonExpression();
    };
    Parser.prototype.parseColumns = function () {
        var columns = [];
        columns.push(this.parseExpression());
        while (this.currentToken && this.currentToken.type === 'COMMA') {
            this.eat('COMMA');
            columns.push(this.parseExpression());
        }
        return columns;
    };
    Parser.prototype.parseSelectStatement = function () {
        this.eat('SELECT');
        var columns = this.parseColumns();
        this.eat('FROM');
        var from = this.parsePrimaryExpression();
        var where;
        if (this.currentToken && this.currentToken.type === 'WHERE') {
            this.eat('WHERE');
            where = this.parseExpression();
        }
        var selectStatementNode = {
            type: 'SELECT_STATEMENT',
            columns: columns,
            from: from,
            where: where,
        };
        return selectStatementNode;
    };
    Parser.prototype.parse = function () {
        return this.parseSelectStatement();
    };
    return Parser;
}());
exports.Parser = Parser;
