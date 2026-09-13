/* Implemetation of Standard Queue*/

#include <stdio.h>
#define MAX 3

struct Queue
{
    int front;
    int rear;
    int items[MAX];
};

void initialize(struct Queue *q) {
    q->front = -1;
    q->rear = -1;
}

void enqueu(struct Queue *q, int val) {
    if (q->rear >= MAX-1) {
        printf("Queue Overflow\n");
        return;
    }
    if (q->front == -1) q->front++;
    q->items[++(q->rear)] = val;
}

int dequeu(struct Queue *q) {
    if (q->front == -1 || q->front > q->rear) {
        printf("Queue Underflow\n");
        return -1;
    }
    return q->items[q->front++];
}

void display(struct Queue q) {
    if (q.front == -1 || q.front > q.rear) {
        printf("Queue Underflow\n");
        return;
    }
    printf("Displaying Contents:\n");
    for (int i=q.front; i<=q.rear; i++) {
        printf("%d\n", q.items[i]);
    }
}

int main() {
    struct Queue q;
    initialize(&q);

    int choice, value;

    do {
        printf("1. Enqueue\n");
        printf("2. Dequeue\n");
        printf("3. Display\n");
        printf("4. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter value to enqueue: ");
                scanf("%d", &value);
                enqueu(&q, value);
                break;
            case 2:
                value = dequeu(&q);
                if (value != -1) {
                    printf("Dequeued value: %d\n", value);
                }
                break;
            case 3:
                display(q);
                break;
            case 4:
                printf("Exiting...\n");
                break;
            default:
                printf("Invalid choice! Please try again.\n");
        }
    } while (choice != 4);

    return 0;
}
