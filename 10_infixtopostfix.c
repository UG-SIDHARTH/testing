/* Infix to Postfix Conversion */


#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

#define MAX 50

struct Stack {
    int top;
    char items[MAX];
};

void initialize(struct Stack *s) {
    s->top = -1;
}

void push(struct Stack *s, char val) {
    if (s->top >= MAX-1) return;
    s->items[++(s->top)] = val;
}

char pop(struct Stack *s) {
    if (s->top == -1) return '\0';
    return s->items[s->top--];
}

char peek(struct Stack s) {
    if (s.top == -1) return '\0';
    return s.items[s.top];
}

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0; // '(' or non-operator
}

int main() {
    struct Stack s;
    initialize(&s);
    char infix[50], buffer;
    int i = 0;
    
    printf("Enter infix expression: ");
    if (fgets(infix, sizeof(infix), stdin) != NULL) {
        infix[strcspn(infix, "\n")] = '\0';
    }
    
    printf("Postfix Expression:\n");
    while (infix[i] != '\0') {
        buffer = infix[i];

        if (buffer == ' ' || buffer == '\t') {
            i++; continue;
        }

        if (isdigit(buffer)) {
            while (isdigit(infix[i])) {
                printf("%c", infix[i]);
                i++;
            }
            printf(" ");
            continue;
        } else if (buffer == '(')
            push(&s, buffer);
        else if (buffer == ')') {
            buffer = pop(&s);
            while (buffer != '(' && buffer != '\0') {
                printf("%c ", buffer);
                buffer = pop(&s);
            }
        } else {
            while (s.top != -1 && precedence(peek(s)) >= precedence(buffer))
                printf("%c ", pop(&s));
            push(&s, buffer);
        }
        
        i++;
    }

    buffer = pop(&s);
    while (buffer != '\0') {
        printf("%c", buffer);
        buffer = pop(&s);
    }
    
    return 0;
}