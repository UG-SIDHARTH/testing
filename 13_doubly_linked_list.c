/* Implementation of Doubly Linked List in C */

#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *prev;
    struct Node *next;
};

struct Node *head = NULL;

void insertAtBeginning() {
    int val;
    printf("Enter data : ");
    scanf("%d", &val);
    
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));

    newNode->data = val;
    newNode->prev = NULL;
    newNode->next = NULL;
    
    if (head == NULL) {
        head = newNode;
        return;
    }
    newNode->next = head;
    head->prev = newNode;
    head = newNode;
}

void insertAtMiddle() {
    int val, key;
    printf("Enter data : ");
    scanf("%d", &val);
    printf("Enter key : ");
    scanf("%d", &key);
    
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    
    newNode->data = val;
    newNode->next = NULL;
    newNode->prev = NULL;
    
    if (head == NULL) {
        printf("List Empty\n");
        return;
    }
    struct Node *temp = head;

    while (temp != NULL && temp->data != key)
        temp = temp->next;

    if (temp == NULL) {
        printf("Key not found\n");
        return;
    }
    
    newNode->next = temp->next;
    newNode->prev = temp;

    if (temp->next != NULL)
        temp->next->prev = newNode;
    
    temp->next = newNode;
}

void insertAtEnd() {
    int val;
    printf("Enter data : ");
    scanf("%d", &val);
    
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    
    newNode->data = val;
    newNode->next = NULL;
    newNode->prev = NULL;
    
    if (head == NULL) {
        head = newNode;
        return;
    }
    struct Node *temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = newNode;
    newNode->prev = temp;
}

void deleteAtBeginning() {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    struct Node *temp = head;
    head = head->next;
    if (head != NULL) {
        head->prev = NULL;
    }
    printf("Deleted element: %d\n", temp->data);
    free(temp);
}

void deleteAtMiddle() {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    int key;
    printf("Enter key to delete : ");
    scanf("%d", &key);
    
    struct Node *temp = head;
    if (head->data == key) {
        head = head->next;
        if (head != NULL)
            head->prev = NULL;
        printf("Deleted element: %d\n", temp->data);
        free(temp);
        return;
    }
    
    while (temp != NULL && temp->data != key)
        temp = temp->next;

    if (temp == NULL) {
        printf("Key not found\n");
        return;
    }
    
    temp->prev->next = temp->next;
    if (temp->next != NULL)
        temp->next->prev = temp->prev;
    printf("Deleted element: %d\n", temp->data);
    free(temp);
}

void deleteAtEnd() {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    struct Node *temp = head;
    if (head->next == NULL) {
        head = NULL;
        printf("Deleted element: %d\n", temp->data);
        free(temp);
        return;
    }
    
    while (temp->next != NULL) {
        temp = temp->next;
    }
    
    temp->prev->next = NULL;
    printf("Deleted element: %d\n", temp->data);
    free(temp);
}

void display() {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    struct Node *temp = head;
    printf("Linked List: ");
    while (temp != NULL) {
        printf("%d <-> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\n");
}

int main() {
    int choice;
    
    do {
        printf("\n- - - Doubly Linked List Menu - - -\n");
        printf("1. Insert at Beginning\n");
        printf("2. Insert at Middle\n");
        printf("3. Insert at End\n");
        printf("4. Delete at Beginning\n");
        printf("5. Delete at Middle\n");
        printf("6. Delete at End\n");
        printf("7. Display\n");
        printf("8. Exit\n");
        printf("Enter choice : ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                insertAtBeginning();
                break;
            case 2:
                insertAtMiddle();
                break;
            case 3:
                insertAtEnd();
                break;
            case 4:
                deleteAtBeginning();
                break;
            case 5:
                deleteAtMiddle();
                break;
            case 6:
                deleteAtEnd();
                break;
            case 7:
                display();
                break;
            case 8:
                printf("Exiting...\n");
                break;
            default:
                printf("Invalid choice! Please try again.\n");
        }
    } while (choice != 8);

    return 0;
}
