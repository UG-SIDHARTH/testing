#include<stdio.h>
#include<ctype.h>
char stack[100];
int top=-1;
void push(char x)
{
stack[++top]=x;
}
char pop()
{
if(top==-1)
return-1;
return stack[top--];
}
int priority(char x)
{
if(x=='(')
return 0;
if(x=='+'||x=='-')
return 1;
if(x=='*'||x=='/')
return 2;
if(x=='^')
return 3;

return 0;
}
int main()
{
char exp[100];
char x;

int i=0;
printf("enter the infix representation:");
scanf("%s",exp);
printf("postfix expression:");
while(exp[i]!='\0')
{
if(isalnum(exp[i]))
{
printf("%c",exp[i]);
}
else if(exp[i]=='(')
{
push(exp[i]);
}
else if(exp[i]==')')
{
while(top!=-1 && (x=pop())!='(')
{
printf("%c",x);
}
}
else
{
while(top!=-1 && stack[top]!='(' && priority(stack[top])>=priority(exp[i]) && exp[i]!='^')
{
printf("%c",pop());
}
push(exp[i]);
}
i++;
}
while(top!=-1){
printf("%c",pop());
}
printf("\n");
return 0;
}
