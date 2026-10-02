/* Implementation of Queue using Linked List in C */

#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

struct Node *front = NULL;
struct Node *rear = NULL;

void enqueue() {
    int val;
    printf("\n Enter value to enqueue: ");
    scanf("%d", &val);
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));

    newNode->data = val;
    newNode->next = NULL;

    if (front == NULL && rear == NULL) {
        front = rear = newNode;
    } else {
        rear->next = newNode;
        rear = newNode;
    }
}

void dequeue() {
    if (front == NULL && rear == NULL) {
        printf("Queue Underflow\n");
        return;
    }
    struct Node *temp = front;
    int val = temp->data;
    front = front->next;
    printf("Dequeued: %d\n", val);
    free(temp);
    if (front == NULL) rear = NULL;
}

void display() {
    if (front == NULL && rear == NULL) {
        printf("Queue Empty\n");
        return;
    }
    printf("Displaying Contents:\n");
    printf("NULL\t");

    struct Node *temp = front;
    while (temp != NULL) {
        printf("%d\t", temp->data);
        temp = temp->next;
    }
    printf("\n");
}
void peek() {
    if (front == NULL && rear == NULL) {
        printf("Queue Empty\n");
        return;
    }
    printf("Displaying last Contents:\n");
    struct Node *temp = front;
    if(temp != NULL) {
        printf("%d\n", temp->data);
    }
}

int main() {
    int choice, value;

    do {
        printf("1. Enqueue\n");
        printf("2. Dequeue\n");
        printf("3. Display\n");
        printf("4. PEEK\n");
        printf("5. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                enqueue();
                break;
            case 2:
                dequeue();
                break;
            case 3:
                display();
                break;
            case 4:
                peek();
                break;    
            case 5:
                printf("Exiting...\n");
                break;
            default:
                printf("Invalid choice! Please try again.\n");
        }
    } while (choice != 5);

    return 0;
}
