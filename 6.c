#include <stdio.h>
#define MAX 5
int stack[MAX];
int top= -1;
void push() {
int item;
if(top==MAX-1)
{
 printf("\n error 404 \n");
 printf("stack overflow \n");
 }
else{
 printf("enter elements:");
 scanf("%d",&item);
 top++;
 stack[top]=item;
 }
}

void pop() {
if(top==-1) {
 printf("\n error 404\n");
 printf("stack underflow\n");
 }
else {
 printf("deleted element:%d\n",stack[top]);
 top--;
 }
}

void display() {
int i;
if(top==-1){
 printf("\n error 404\n");
 printf("stack is empty\n");
 }
else {
 printf("stack elements are:\n");
  for(i=top;i>=0;i--){
   printf("%d\n",stack[i]); 
   }
  }
 }
 int main() {
 int choice;
 do{
  printf("\n 1.push \n 2.pop \n 3.display \n 4.exit \n ");
  printf("enter your choice:");
  scanf("%d",&choice);
  switch(choice){
   case 1:
     push();
     break;
   case 2:
     pop();
     break;
   case 3:
     display();
     break;
   case 4:
     printf("you have succesfully exited \n ");
     break;
    default:
   printf("invalid choice \n ");}
  
 } while (choice!=4);
 
 return 0;
}