/* Implementation of Postfix Expression Evaluation */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX 50

struct Stack {
    int top;
    int items[MAX];
};

struct Stack* createStack() {
    struct Stack* stack = (struct Stack*)malloc(sizeof(struct Stack));
    stack->top = -1;
    return stack;
}

void push(struct Stack* s, int item) {
    if (s->top >= MAX - 1) {
        printf("Stack overflow\n");
        return;
    }
    s->items[++(s->top)] = item;
}

int pop(struct Stack* s) {
    if (s->top == -1) {
        return -999999;
    }
    return s->items[(s->top)--];
}

int main() {
    struct Stack* stack = createStack();
    char postfix[MAX];

    printf("Enter the postfix expression: ");
    fgets(postfix, MAX, stdin);

    // Strip newline character if present
    size_t len = strlen(postfix);
    if (len > 0 && postfix[len - 1] == '\n') {
        postfix[len - 1] = '\0';
    }

    for (int i = 0; postfix[i]; i++) {
        if (isdigit(postfix[i])) {
            push(stack, postfix[i] - '0'); // Convert char directly to int digit
        } else if (postfix[i] == ' ' || postfix[i] == '\t') {
            continue;
        } else {
            int val2 = pop(stack);
            int val1 = pop(stack);

            if (val1 == -999999 || val2 == -999999) {
                printf("Invalid postfix expression\n");
                free(stack);
                return -1;
            }

            switch (postfix[i]) {
                case '+':
                    push(stack, val1 + val2);
                    break;
                case '-':
                    push(stack, val1 - val2);
                    break;
                case '*':
                    push(stack, val1 * val2);
                    break;
                case '/':
                    if (val2 == 0) {
                        printf("Division by zero error\n");
                        free(stack);
                        return -1;
                    }
                    push(stack, val1 / val2);
                    break;
                default:
                    printf("Invalid operator: %c\n", postfix[i]);
                    free(stack);
                    return -1;
            }
        }
    }

    printf("Result: %d\n", pop(stack));

    free(stack);
    return 0;
}
