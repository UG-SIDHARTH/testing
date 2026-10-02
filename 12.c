#include <stdio.h>
#include <stdlib.h>
struct Node {
 int data;
 struct Node*next;
};
struct Node*head=NULL;

void insertAtEnd(int value) {
struct Node *newNode=(struct Node*) malloc(sizeof(struct Node));
newNode->data=value;
newNode->next=NULL;
if(head==NULL) {
 head= newNode;
 }
else {
 struct Node *temp=head;
 while (temp->next!=NULL) {
 temp=temp->next;
 }
temp->next=newNode;
}
}

void insertAtBeginning(int value) {
struct Node *newNode=(struct Node*) malloc(sizeof(struct Node));
newNode->data=value;
newNode->next=head;
head=newNode;
}

void insertAtPosition(int value,int position) {
struct Node *newNode=(struct Node*) malloc(sizeof(struct Node));
newNode->data=value;
newNode->next=NULL;
if (position==1) {
newNode->next=head;
head=newNode;
return;
}
struct Node *temp=head;
for(int i=1;i<position-1;i++) {
if(temp==NULL) {
 printf("invalid position:\n");
 return;
}
temp=temp->next;
temp->next=newNode;
}
}
void deleteAtBeginning() {
if (head==NULL) {
 printf("list is empty:\n");
 return;
}
struct Node *temp=head;
head=head->next;
free(temp);
}

void deleteAtEnd() {
if (head==NULL) {
 printf("list is empty:\n");
 return;
}
if (head->next==NULL){
 free(head);
 head=NULL; 
 return;
}
struct Node *temp=head;
while(temp->next->next!=NULL){
temp=temp->next;
}
free(temp->next);
temp->next=NULL;
}

void deleteAtPosition() {
int position;
if (head==NULL) {
 printf("list is empty:\n");
 return;
 }
if (position==1) {
struct Node *temp=head;
head=head->next;
free(temp);
return;
}
struct Node *temp=head;
for(int i=1;i<position-1;i++) {
if(temp==NULL) {
 printf("invalid position:\n");
 return;
}
temp=temp->next;
}
if(temp->next==NULL) {
printf("invalid position! \n");
return;
}
struct Node *deleteNode=temp->next;
temp->next=deleteNode->next;
free(deleteNode);
}

void display() {
if (head==NULL) {
printf("list is empty! \n");
return;
}
struct Node *temp=head;
printf("linked list:");
while (temp!=NULL) {
printf("%d->",temp->data);
temp=temp->next;
}
printf("NULL\n");
}

int main() {
int choice,value,position;
while(1) {
printf("\n singly linked list operation   \n");
printf("\n1.insert at End\n");
printf("\n2.insert at Beginning\n");
printf("\n3.insert at Position\n");
printf("\n4.delete at Beginning\n");
printf("\n5.delete at End\n");
printf("\n6.delete at Position\n");
printf("\n7.display list\n");
printf("\n8.exit\n");
printf("enter your choice:");
scanf("%d",&choice);
switch (choice) {
 case 1:
    printf("enter value to insert at End:");
    scanf("%d",&value);
    insertAtEnd(value);
    break;
 case 2:
    printf("enter value to insert at Beginning:");
    scanf("%d",&value);
    insertAtBeginning(value);
    break;
 case 3:
    printf("enter value to insert:");
    scanf("%d",&value);
    printf("enter position:");
    scanf("%d",&position);
    insertAtPosition(value,position);
    break;
 case 4:
    deleteAtBeginning();
    break;
 case 5:
    deleteAtEnd();
    break;
 case 6:
    printf("enter position to delete:");
    scanf("%d",&position);
    deleteAtPosition(position);
    break;
 case 7:
    display();
    break;
 case 8:
    printf("exiting  \n");
    exit(0);
    default:
    printf("invalid choice!try again\n");
  }
 }
return 0;
}