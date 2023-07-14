interface Token {
    type: string;
    value: string;
  }
  
  class Lexer {
    private input: string;
    private position: number = 0;
    private currentChar: string | null = null;
  
    constructor(input: string) {
      this.input = input;
      this.currentChar = this.input[this.position];
    }
  
    private advance(): void {
      this.position++;
      if (this.position > this.input.length - 1) {
        this.currentChar = null;
      } else {
        this.currentChar = this.input[this.position];
      }
    }
  
    private skipWhitespace(): void {
      while (this.currentChar !== null && /\s/.test(this.currentChar)) {
        this.advance();
      }
    }
  
    private isLetter(char: string | null): boolean {
      return char !== null && /[a-zA-Z]/.test(char);
    }
  
    private isDigit(char: string | null): boolean {
      return char !== null && /\d/.test(char);
    }
  
    private peek(): string | null {
      const peekPosition = this.position + 1;
      if (peekPosition > this.input.length - 1) {
        return null;
      } else {
        return this.input[peekPosition];
      }
    }
  
    private getIdentifer(): string {
      let result = '';
      while (this.currentChar !== null && (this.isLetter(this.currentChar) || this.isDigit(this.currentChar))) {
        result += this.currentChar;
        this.advance();
      }
      return result.toUpperCase();
    }
  
    private getNumber(): string {
      let result = '';
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
    }
  
    public tokenize(): Token[] {
        let token:Token|null = this.getNextToken();
        const tokens:Array<Token> = [];
        while(token){
            tokens.push(token);
            token = this.getNextToken()
        }
        return tokens;
    }
    public getNextToken(): Token | null {
      while (this.currentChar !== null) {
        if (/\s/.test(this.currentChar)) {
          this.skipWhitespace();
          continue;
        }
  
        if (this.currentChar === ',') {
          this.advance();
          return { type: 'COMMA', value: ',' };
        }

        if(this.currentChar === ';'){
            this.advance();
            return {type: 'SEMI', value: ';'};
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
            const value = '==';
            this.advance();
            this.advance();
            return { type: 'EQUAL', value };
          }
          this.advance();
          return { type: 'EQUAL', value: '=' };
        }
  
        if (this.currentChar === '!') {
          if (this.peek() === '=') {
            const value = '!=';
            this.advance();
            this.advance();
            return { type: 'NOT_EQUAL', value };
          }
          throw new Error(`Unexpected character: ${this.currentChar}`);
        }
  
        if (this.currentChar === '<') {
          if (this.peek() === '=') {
            const value = '<=';
            this.advance();
            this.advance();
            return { type: 'LESS_EQUAL', value };
          }
          this.advance();
          return { type: 'LESS', value: '<' };
        }
  
        if (this.currentChar === '>') {
          if (this.peek() === '=') {
            const value = '>=';
            this.advance();
            this.advance();
            return { type: 'GREATER_EQUAL',value };
          }
          this.advance();
          return { type: 'GREATER', value: '>' };
        }
  
        if (this.isLetter(this.currentChar)) {
           const identifer =  this.getIdentifer();
           if(identifer === 'SELECT'){
                return {type: 'SELECT', value: 'SELECT'}
            }
            if(identifer === 'FROM'){
                return {type: 'FROM', value: 'FROM'}
            }
            if(identifer === 'WHERE'){
                return {type: 'WHERE', value: 'WHERE'}
            }
          return { type: 'IDENTIFIER', value: identifer };
        }
  
        if (this.isDigit(this.currentChar)) {
          return { type: 'NUMBER', value: this.getNumber() };
        }
  
        throw new Error(`Unexpected character: ${this.currentChar}`);
      }
  
      return null;
    }
  }
  
  interface ASTNode {
    type: string;
  }
  
  interface IdentifierNode extends ASTNode {
    type: 'IDENTIFIER';
    value: string;
  }
  
  interface NumberNode extends ASTNode {
    type: 'NUMBER';
    value: number;
  }
  
  interface BinaryExpressionNode extends ASTNode {
    type: 'BINARY_EXPRESSION';
    operator: OperatorNode;
    left: ASTNode;
    right: ASTNode;
  }
  
  interface OperatorNode extends ASTNode {
    type: 'OPERATOR';
    value: string;
  }
  
  interface SelectStatementNode extends ASTNode {
    type: 'SELECT_STATEMENT';
    columns: (IdentifierNode | BinaryExpressionNode)[];
    from: IdentifierNode;
    where?: BinaryExpressionNode;
  }
  
  class Parser {
    private tokens: Token[];
    private currentIndex: number = 0;
    private currentToken: Token | null = null;
  
    constructor(tokens: Token[]) {
      this.tokens = tokens;
      this.currentToken = this.tokens[this.currentIndex];
    }
  
    private eat(tokenType: string): void {
      if (this.currentToken === null) {
        throw new Error(`Unexpected end of input`);
      }
      if (this.currentToken.type !== tokenType) {
        throw new Error(`Unexpected token: ${this.currentToken.type}, expected: ${tokenType}`);
      }
      this.currentIndex++;
      this.currentToken = this.tokens[this.currentIndex];
    }
  private parsePrimaryExpression(): ASTNode {
    if (this.currentToken === null) {
      throw new Error(`Unexpected end of input`);
    }
  
    if (this.currentToken.type === 'IDENTIFIER') {
      const identifierNode: IdentifierNode = {
        type: 'IDENTIFIER',
        value: this.currentToken.value,
      };
      this.eat('IDENTIFIER');
      return identifierNode;
    }
  
    if (this.currentToken.type === 'NUMBER') {
      const numberNode: NumberNode = {
        type: 'NUMBER',
        value: Number(this.currentToken.value),
      };
      this.eat('NUMBER');
      return numberNode;
    }
  
    if (this.currentToken.type === 'LEFT_PAREN') {
      this.eat('LEFT_PAREN');
      const expressionNode = this.parseExpression();
      this.eat('RIGHT_PAREN');
      return expressionNode;
    }
  
    throw new Error(`Unexpected token: ${this.currentToken.type}`);
  }
    
  
    private parseMultiplicativeExpression(): BinaryExpressionNode | ASTNode {
      let leftNode = this.parsePrimaryExpression();
  
      while (this.currentToken && (this.currentToken.type === 'MULTIPLY' || this.currentToken.type === 'DIVIDE' || this.currentToken.type === 'MODULO')) {
        const operatorNode: OperatorNode = {
          type: 'OPERATOR',
          value: this.currentToken.value,
        };
        this.eat(this.currentToken.type);
        const rightNode = this.parsePrimaryExpression();
         return {
          type: 'BINARY_EXPRESSION',
          operator: operatorNode,
          left: leftNode,
          right: rightNode,
        };
      }
  
      return leftNode as BinaryExpressionNode;
    }
  
    private parseAdditiveExpression(): BinaryExpressionNode {
      let leftNode = this.parseMultiplicativeExpression();
  
      while (this.currentToken && (this.currentToken.type === 'PLUS' || this.currentToken.type === 'MINUS')) {
        const operatorNode: OperatorNode = {
          type: 'OPERATOR',
          value: this.currentToken.value,
        };
        this.eat(this.currentToken.type);
        const rightNode = this.parseMultiplicativeExpression();
        leftNode = {
          type: 'BINARY_EXPRESSION',
          operator: operatorNode,
          left: leftNode,
          right: rightNode,
        };
      }
  
      return leftNode as BinaryExpressionNode;
    }
  
    private parseComparisonExpression(): BinaryExpressionNode {
      let leftNode = this.parseAdditiveExpression();
  
      while (
        this.currentToken &&
        (this.currentToken.type === 'EQUAL' ||
          this.currentToken.type === 'NOT_EQUAL' ||
          this.currentToken.type === 'LESS_THAN' ||
          this.currentToken.type === 'LESS_THAN_OR_EQUAL' ||
          this.currentToken.type === 'GREATER_THAN' ||
          this.currentToken.type === 'GREATER_THAN_OR_EQUAL')
      ) {
        const operatorNode: OperatorNode = {
          type: 'OPERATOR',
          value: this.currentToken.value,
        };
        this.eat(this.currentToken.type);
        const rightNode = this.parseAdditiveExpression();
        leftNode = {
          type: 'BINARY_EXPRESSION',
          operator: operatorNode,
          left: leftNode,
          right: rightNode,
        };
      }
  
      return leftNode as BinaryExpressionNode;
    }
  
    private parseExpression(): BinaryExpressionNode {
      return this.parseComparisonExpression();
    }
  
    private parseColumns(): (IdentifierNode | BinaryExpressionNode)[] {
      const columns: (IdentifierNode | BinaryExpressionNode)[] = [];
      columns.push(this.parseExpression());
  
      while (this.currentToken && this.currentToken.type === 'COMMA') {
        this.eat('COMMA');
        columns.push(this.parseExpression());
      }
  
      return columns;
    }
  
    private parseSelectStatement(): SelectStatementNode {
      this.eat('SELECT');
      const columns = this.parseColumns();
      this.eat('FROM');
      const from = this.parsePrimaryExpression();
      let where;
  
      if (this.currentToken && this.currentToken.type === 'WHERE') {
        this.eat('WHERE');
        where = this.parseExpression();
      }
  
      const selectStatementNode: SelectStatementNode = {
        type: 'SELECT_STATEMENT',
        columns,
        from: from as IdentifierNode,
        where,
      };
  
      return selectStatementNode;
    }
  
    public parse(): ASTNode {
      return this.parseSelectStatement();
    }
  }

  export  {
    Lexer,Parser
  }