#include <stdio.h>
#define MAX 5
    
int deque[MAX];
int front=-1,rear=-1;
// TO PUSH THE VALUE INTO DEQUEE
void push() {
int item;
if((front==0 && rear==MAX-1)||(front==rear+1))
{
 printf("deque is full\n");
 return;
}
printf("enter element:");
scanf("%d",&item);
if (front==-1)
 front=rear=0;
 else if (front==0)
 front=MAX-1;
 else 
  front--;
 deque[front]=item;
}
// TO INJECT THE VALUE INTO DEQUEE

void inject () {
int item;
if((front==0 && rear==MAX-1)||(front==rear+1))
{
 printf("deque is full\n");
 return;
}
printf("enter element:");
scanf("%d",&item);
if (front==-1)
 front=rear=0;
 else if(rear== MAX-1)
  rear=0;
 else 
 rear++;
deque[rear]=item;
}
// TO POP THE VALUE INTO DEQUEE

void pop() {
if (front==-1) {
 printf("deque is empty\n");
 return;
}
printf("deleted element:%d \n",deque[front]);
if (front==rear)
 front=rear=-1;
else if (front== MAX-1 )
 front=0;
else 
 front++;
}
// TO EJECT THE VALUE INTO DEQUEE

void eject () {
if (front==-1) {
 printf("deque is empty\n");
 return;
}
printf("deleted element:%d \n",deque[rear]);
if (front==rear)
front=rear=-1;
else if (rear==0)
 front= MAX-1;
else 
 rear--;
}
// TO DISPLAY THE VALUE INTO DEQUEE

void display () {
int i;
if(front==-1) {
printf("deque is empty\n");
return; 
}
printf("deque elements are:\n");
i=front;
while(1)
{
 printf("%d\t",deque[i]);
 if(i==rear)
 break;
 i=(i+1)% MAX;
}
printf("\n");
printf("\t");
}

int main () {
int choice;
while(1)
{
printf("\n  DEQUE  \n");
printf("1.push \n");
printf("2.inject \n");
printf("3.pop\n");
printf("4.eject\n");
printf("5.display\n");
printf("6.exit\n");
printf("enter your choice:");
scanf("%d",&choice);
switch (choice) {
case 1: 
 push();
 break;
case 2:
 inject();
 break;
case 3:
 pop();
 break;
case 4:
 eject();
 break;
case 5:
 display();
 break;
case 6:
 return 0;
 default:
printf("invalid choice\n");
}
}
}    