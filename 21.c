#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left, *right;
};

// Create a new node
struct Node* createNode(int value) {
    struct Node* newNode = malloc(sizeof(struct Node));

    if (newNode == NULL) {
        printf("Memory allocation failed!\n");
        exit(1);
    }

    newNode->data = value;
    newNode->left = NULL;
    newNode->right = NULL;

    return newNode;
}

// Create tree using integer input
struct Node* createTree() {
    int value;

    printf("Enter number (-1 for no node): ");
    scanf("%d", &value);

    if (value == -1)
        return NULL;

    struct Node* root = createNode(value);

    printf("Enter left child of %d:\n", value);
    root->left = createTree();

    printf("Enter right child of %d:\n", value);
    root->right = createTree();

    return root;
}

// Pre-order: Root, Left, Right
void preorder(struct Node* root) {
    if (root == NULL)
        return;

    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}

// In-order: Left, Root, Right
void inorder(struct Node* root) {
    if (root == NULL)
        return;

    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

// Post-order: Left, Right, Root
void postorder(struct Node* root) {
    if (root == NULL)
        return;

    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}

// Level-order traversal
void levelorder(struct Node* root) {
    if (root == NULL)
        return;

    struct Node* queue[100];
    int front = 0, rear = 0;

    queue[rear++] = root;

    while (front < rear) {
        struct Node* temp = queue[front++];
        printf("%d ", temp->data);

        if (temp->left != NULL)
            queue[rear++] = temp->left;

        if (temp->right != NULL)
            queue[rear++] = temp->right;
    }
}

int main() {
    struct Node* root;

    printf("Create the binary tree:\n");
    root = createTree();

    printf("\nPre-order: ");
    preorder(root);

    printf("\nIn-order: ");
    inorder(root);

    printf("\nPost-order: ");
    postorder(root);

    printf("\nLevel-order: ");
    levelorder(root);

    printf("\n");

    return 0;
}