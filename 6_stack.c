/* Implementation of a stack in C */

#include <stdio.h>
#define MAX 10

struct Stack {
    int top;
    int items[MAX];
};

void initialize(struct Stack *s) {
    s->top = -1;
}

void push(struct Stack *s, int val) {
    if (s->top >= MAX-1) {
        printf("Stack Overflow\n");
        return;
    }
    s->items[++(s->top)] = val;
}

int pop(struct Stack *s) {
    if (s->top == -1) {
        printf("Stack Underflow\n");
        return -1;
    }
    return s->items[s->top--];
}

void display(struct Stack s) {
    if (s.top == -1) {
        printf("Stack Underflow\n");
        return;
    }
    printf("Displaying contents:\n");
    for (int i=0; i<=s.top; i++) {
        printf("%d\n", s.items[i]);
    }
}

int main() {
    struct Stack s;
    initialize(&s);

    int choice, value;

    do {
        printf("1. Push\n");
        printf("2. Pop\n");
        printf("3. Display\n");
        printf("4. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter value to push: ");
                scanf("%d", &value);
                push(&s, value);
                break;
            case 2:
                value = pop(&s);
                if (value != -1) {
                    printf("Popped value: %d\n", value);
                }
                break;
            case 3:
                display(s);
                break;
            case 4:
                printf("Exiting...\n");
                break;
            default:
                printf("Invalid choice. Please try again.\n");
        }
    } while (choice != 4);

    return 0;
}