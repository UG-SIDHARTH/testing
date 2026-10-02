#include<stdio.h>
int main()
{
int a[10][3],t[100][3];
int r,c,i,j,k=1;
printf("enter row and column");
scanf("%d%d",&r,&c);
printf("enter elements of matrix:\n");
for(i=0;i<r;i++)
{
for(j=0;j<c;j++)
{
scanf("%d",&a[i][j]);
}
}
t[0][0]=r;
t[0][1]=c;
t[0][2]=0;
for(i=0;i<r;i++)
{
for(j=0;j<c;j++)
{
if(a[i][j]!=0)
{
t[k][0]=i;
t[k][1]=j;
t[k][2]=a[i][j];
k++;
t[0][2]++;
}
}
}
printf("tuple representation:\n");
printf("row column value:\n");
for(i=0;i<k;i++)
printf("%d\t%d\t%d\n",t[i][0],t[i][1],t[i][2]);
return 0;
}
