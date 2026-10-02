#include <stdio.h>
int main(){
int s[20][3],t[20][3];
int i,j,k=1;
printf("enter rows and columns and number of non zeros:");
scanf("%d %d %d",&s[0][0],&s[0][1],&s[0][2]);
printf("enter rows columns value for each non zero elements:\n");
for(i=1;i<=s[0][2];i++){
 scanf("%d %d %d",&s[i][0],&s[i][1],&s[i][2]);
 }
t[0][0]=s[0][1];
t[0][1]=s[0][0];
t[0][2]=s[0][2];
for(i=0;i<s[0][1];i++){
 for(j=1; j <=s[0][2]; j++){
  if(s[j][1]==i){
  t[k][0]=s[j][1];
  t[k][1]=s[j][0];
  t[k][2]=s[j][2];
  k++;
  }
 }
}
printf("\n transpose of sparce matrix:\n");
printf("row\tcolumn\tvalue\n");
for(i=0;i<=t[0][2];i++){
 printf("%d\t%d\t%d\n",t[i][0],t[i][1],t[i][2]);
}
return 0;
}