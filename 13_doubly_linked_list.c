/* Implementation of Doubly Linked List in C */

#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *prev;
    struct Node *next;
};

struct Node *head = NULL;

// 1. Create Node / List
void create() {
    int val;
    printf("Enter data : ");
    scanf("%d", &val);

    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    if (newNode == NULL) {
        printf("Memory allocation failed!\n");
        return;
    }
    newNode->data = val;
    newNode->prev = NULL;
    newNode->next = NULL;

    if (head == NULL) {
        head = newNode;
    } else {
        struct Node *temp = head;
        while (temp->next != NULL) {
            temp = temp->next;
        }
        temp->next = newNode;
        newNode->prev = temp;
    }
    printf("Node created successfully\n");
}

// 2. Display List
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

// 3. Search Element
void search() {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    int key, pos = 1, found = 0;
    printf("Enter element to search : ");
    scanf("%d", &key);

    struct Node *temp = head;
    while (temp != NULL) {
        if (temp->data == key) {
            printf("Element %d found at position %d\n", key, pos);
            found = 1;
            break;
        }
        temp = temp->next;
        pos++;
    }
    if (!found) {
        printf("Element %d not found in the list\n", key);
    }
}

// 4. Insert at Beginning
void insertAtBeginning() {
    int val;
    printf("Enter data : ");
    scanf("%d", &val);

    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    if (newNode == NULL) {
        printf("Memory allocation failed!\n");
        return;
    }
    newNode->data = val;
    newNode->prev = NULL;
    newNode->next = head;

    if (head != NULL) {
        head->prev = newNode;
    }
    head = newNode;
    printf("Node inserted successfully at beginning\n");
}

// 5. Insert at Middle (by position)
void insertAtMiddle() {
    int val, pos, i;
    printf("Enter data : ");
    scanf("%d", &val);
    printf("Enter position : ");
    scanf("%d", &pos);

    if (pos < 1) {
        printf("Invalid position!\n");
        return;
    }

    if (pos == 1) {
        insertAtBeginning();
        return;
    }

    struct Node *temp = head;
    for (i = 1; i < pos - 1 && temp != NULL; i++) {
        temp = temp->next;
    }

    if (temp == NULL) {
        printf("Position out of range!\n");
        return;
    }

    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    if (newNode == NULL) {
        printf("Memory allocation failed!\n");
        return;
    }
    newNode->data = val;
    newNode->next = temp->next;
    newNode->prev = temp;

    if (temp->next != NULL) {
        temp->next->prev = newNode;
    }
    temp->next = newNode;

    printf("Node inserted successfully at position %d\n", pos);
}

// 6. Insert at End
void insertAtEnd() {
    int val;
    printf("Enter data : ");
    scanf("%d", &val);

    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    if (newNode == NULL) {
        printf("Memory allocation failed!\n");
        return;
    }
    newNode->data = val;
    newNode->next = NULL;
    newNode->prev = NULL;

    if (head == NULL) {
        head = newNode;
    } else {
        struct Node *temp = head;
        while (temp->next != NULL) {
            temp = temp->next;
        }
        temp->next = newNode;
        newNode->prev = temp;
    }
    printf("Node inserted successfully at end\n");
}

// 7. Delete at Beginning
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

// 8. Delete at Middle (by position)
void deleteAtMiddle() {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    int pos, i;
    printf("Enter position to delete : ");
    scanf("%d", &pos);

    if (pos < 1) {
        printf("Invalid position!\n");
        return;
    }

    if (pos == 1) {
        deleteAtBeginning();
        return;
    }

    struct Node *temp = head;
    for (i = 1; i < pos && temp != NULL; i++) {
        temp = temp->next;
    }

    if (temp == NULL) {
        printf("Position out of range!\n");
        return;
    }

    if (temp->prev != NULL) {
        temp->prev->next = temp->next;
    }
    if (temp->next != NULL) {
        temp->next->prev = temp->prev;
    }

    printf("Deleted element: %d\n", temp->data);
    free(temp);
}

// 9. Delete at End
void deleteAtEnd() {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    struct Node *temp = head;
    if (head->next == NULL) {
        printf("Deleted element: %d\n", head->data);
        free(head);
        head = NULL;
        return;
    }

    while (temp->next != NULL) {
        temp = temp->next;
    }

    temp->prev->next = NULL;
    printf("Deleted element: %d\n", temp->data);
    free(temp);
}

int main() {
    int choice;

    do {
        printf("\n- - - Doubly Linked List Menu - - -\n");
        printf("1. Create\n");
        printf("2. Display\n");
        printf("3. Search\n");
        printf("4. Insert at Beginning\n");
        printf("5. Insert at Middle\n");
        printf("6. Insert at End\n");
        printf("7. Delete at Beginning\n");
        printf("8. Delete at Middle\n");
        printf("9. Delete at End\n");
        printf("10. Exit\n");
        printf("Enter choice : ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                create();
                break;
            case 2:
                display();
                break;
            case 3:
                search();
                break;
            case 4:
                insertAtBeginning();
                break;
            case 5:
                insertAtMiddle();
                break;
            case 6:
                insertAtEnd();
                break;
            case 7:
                deleteAtBeginning();
                break;
            case 8:
                deleteAtMiddle();
                break;
            case 9:
                deleteAtEnd();
                break;
            case 10:
                printf("Exiting...\n");
                break;
            default:
                printf("Invalid choice! Please try again.\n");
        }
    } while (choice != 10);

    return 0;
}
