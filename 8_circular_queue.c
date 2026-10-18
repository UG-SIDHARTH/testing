/* Circular Queue Implementation */

#include <stdio.h>
#define MAX 3

struct CircularQueue
{
    int front;
    int rear;
    int count;
    int items[MAX];
};

void initialize(struct CircularQueue *q) {
    q->front = 0;
    q->rear = MAX - 1;
    q->count = 0;
}

void enqueue(struct CircularQueue *q, int val) {
    if (q->count >= MAX) {
        printf("Queue Overflow\n");
        return;
    }
    q->rear = (q->rear+1)%MAX;
    q->items[q->rear] = val;
    q->count++;
}

int dequeue(struct CircularQueue *q) {
    if (q->count == 0) {
        printf("Queue Underflow\n");
        return -1;
    }
    int val = q->items[q->front];
    q->front = (q->front+1)%MAX;
    q->count--;
    return val;
}

void display(struct CircularQueue q) {
    if (q.count == 0) {
        printf("Queue empty\n");
        return;
    }

    printf("Displaying Contents:\n");
    for (int i=q.front; i < q.front+q.count; i++) {
        printf("%d\n", q.items[i%MAX]);
    }
}

int main() {
    struct CircularQueue q;
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
