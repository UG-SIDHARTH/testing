#include <stdio.h>
#define MAX 5

int queue[MAX];
int front= -1,rear= -1;
 
 void enqueue() {
 int item;
 if(rear==MAX-1){
  printf("queue is overflow\n"); }
 else {
  if (front==-1)
   front=0;
   printf("enter the element:");
   scanf("%d",&item);
   rear++;
   queue[rear]=item;
   }
  }
 void dequeue() {
  if(front== -1|| front>rear){
   printf("queue underflow\n"); }
  else {
   printf("deleted element:%d\n",queue[front]);
   front++;
   if(front>rear)
    front=rear=-1;
   }
 }
 void display() {
 int i;
 if(front== -1){
  printf("queue is empty\n"); }
 else {
  printf("queue elements are:\n");
 for(i=front;i<=rear;i++){
  printf("%d\n",queue[i]);
  }
 }
}
int main() {
int choice;
 do{
  printf("\n1.enqueue \n 2.dequeue \n 3.display \n 4.exit \n");
  printf("enter your choice:");
  scanf("%d",&choice);
  switch (choice){
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
    printf("you have sucessfully exited\n");
    break;
   default:
   printf("invalid choice\n"); }
  } while(choice!=4);
  return 0;
}
