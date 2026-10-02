#include <stdio.h>
#define MAX 5

int queue[MAX];
int front= -1,rear= -1, count=0;
 // enqueue
 void enqueue() {
 int item;
 if(count==MAX){
  printf("circular queue is overflow\n"); }
 else {
  if (front==-1)
   front=0;
   printf("enter the element:");
   scanf("%d",&item);
   rear=(rear+1)% MAX;
   count++;
   queue[rear]=item;
   }
  }
  //dequeue
 void dequeue() {
  if(count==0){
   printf("circular queue underflow\n"); }
  else {
   printf("deleted element:%d\n",queue[front]);
   front=(front+1)% MAX;
   count--;
 } }
 // diplay
 void display() {
 int i;
 if(count==0){
  printf("circular queue is empty\n"); }
 else {
  printf("queue elements are:\n");
 for(i=front;i<=rear;i++){
  printf("%d\n",queue[i]);
  }
 }
}
//peak of the last element
int peek() {
    if (count == 0) {
        printf("queue is empty\n"); }
 else {
  printf("peeked value: %d\n", queue[front]);
    }
}
int main() {
int choice;
 do{
  printf("\n1.enqueue \n 2.dequeue \n 3.peek \n 4.display \n 5.exit \n");
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
    peek();
    break; 
   case 4:
    display();
    break;
   case 5:
    printf("you have sucessfully exited\n");
    break;
   default:
   printf("invalid choice\n"); }
  } while(choice!=5);
  return 0;
}