/* Double Ended Queue Implementation */

#include <stdio.h>
#define MAX 10

struct Dequeue {
    int front;
    int rear;
    int items[MAX];
};

void initializeDeque(struct Dequeue *dq) {
    dq->front = -1;
    dq->rear = -1;
}

void insertFront(struct Dequeue *dq, int val) {
    if (dq->front == 0 && dq->rear == MAX-1) {
        printf("Queue Overflow\n");
        return;
    }

    if (dq->front == -1) {
        dq->items[++dq->front] = val;
        dq->rear++;
    } else if (dq->front > 0)
        dq->items[--dq->front] = val;
    else {
        int i = dq->rear;
        while (i>=dq->front) {
            dq->items[i+1] = dq->items[i];
            i--;
        }
        dq->items[dq->front] = val;
        dq->rear++;
    }
}

void insertRear(struct Dequeue *dq, int val) {
    if (dq->front == 0 && dq->rear == MAX-1) {
        printf("Queue Overflow\n");
        return;
    }
    
    if (dq->front == -1) {
        dq->items[++dq->front] = val;
        dq->rear++;
    } else if (dq->rear < MAX-1)
        dq->items[++dq->rear] = val;
    else {
        int i = dq->front;
        while (i<=dq->rear) {
            dq->items[i-1] = dq->items[i];
            i++;
        }
        dq->items[dq->rear] = val;
        dq->front--;
    }
}

int removeFront(struct Dequeue *dq) {
    if (dq->front == -1 && dq->rear == -1) {
        printf("Queue Underflow\n");
        return -1;
    }
    int val = dq->items[dq->front];

    if (dq->front == dq->rear) {
        dq->front = dq->rear = -1;
    } else 
        dq->front++;

    return val;
}

int removeRear(struct Dequeue *dq) {
    if (dq->front == -1 && dq->rear == -1) {
        printf("Queue Underflow\n");
        return -1;
    }
    int val = dq->items[dq->rear];

    if (dq->front == dq->rear) {
        dq->front = dq->rear = -1;
    } else 
        dq->rear--;

    return val;
}

void display(struct Dequeue dq) {
    if (dq.front == -1) {
        printf("Queue is Empty\n");
        return;
    }
    printf("Displaying Contents:\n");
    for (int i=dq.front; i<=dq.rear; i++)
        printf("%d\n", dq.items[i]);
}

int main() {
    struct Dequeue dq;
    initializeDeque(&dq);

    int choice, value;

    do {
        printf("1. Insert Front\n");
        printf("2. Insert Rear\n");
        printf("3. Remove Front\n");
        printf("4. Remove Rear\n");
        printf("5. Display\n");
        printf("6. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter value to insert at front: ");
                scanf("%d", &value);
                insertFront(&dq, value);
                break;
            case 2:
                printf("Enter value to insert at rear: ");
                scanf("%d", &value);
                insertRear(&dq, value);
                break;
            case 3:
                value = removeFront(&dq);
                if (value != -1)
                    printf("Removed from front: %d\n", value);
                break;
            case 4:
                value = removeRear(&dq);
                if (value != -1)
                    printf("Removed from rear: %d\n", value);
                break;
            case 5:
                display(dq);
                break;
            case 6:
                printf("Exiting...\n");
                break;
            default:
                printf("Invalid choice! Please try again.\n");
        }
    } while (choice != 6);

    return 0;
}
