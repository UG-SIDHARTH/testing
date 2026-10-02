#include<stdio.h>
struct poly
{
int coeff;
int exp;
};
void main()
{
struct poly p1[10],p2[10],sum[10];
int n1,n2,i,j,k;
printf("enter the no of elements of p1");
scanf("%d",&n1);
printf("enter the coefficient and exponential:\n");
for(i=0;i<n1;i++)
{
scanf("%d%d",&p1[i].coeff,&p1[i].exp);
}
printf("enter the no of elements of p2");
scanf("%d",&n2);
printf("enter the coefficient and exponential:\n");
for(j=0;j<n2;j++)
scanf("%d%d",&p2[j].coeff,&p2[j].exp);
i=j=k=0;
while(i<n1&&j<n2)
{
if(p1[i].exp==p2[j].exp)
{
sum[k].coeff=p1[i].coeff+p2[j].coeff;
sum[k].exp=p1[i].exp;
i++;
k++;
j++;
}
else if(p1[i].exp>p2[j].exp)
{
sum[k]=p1[i];
i++;
k++;
}
else
{
sum[k]=p2[j];
j++;
k++;
}
}
while(i<n1)
{
sum[k]=p1[i];
k++;
i++;
}
while(j<n2)
{
sum[k]=p2[j];
j++;
k++;
}
printf("resultant polynomial:");
for(i=0;i<k;i++)
{
printf("%dx^%d",sum[i].coeff,sum[i].exp);
if(i!=k-1)
{
printf("+");
}
}
}