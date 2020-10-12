利用脚手架 koa-generator生成项目
cnpm i koa-generator -g     // 全局安装脚手架
koa2 项目名称                 // 生成项目

PM2的使用
1、下载安装
cnpm i pm2 -g
pm2 --version
```
启动
pm2 start app.js（也可跟一个配置文件）
查看pm2运行的进程列表
pm2 list
重启
pm2 restart <AppName>/<id>
停止
pm2 stop <AppName>/<id>
删除
pm2 delete <AppName>/<id>
查看信息
pm2 info <AppName>/<id>
查看日志
pm2 log <AppName>/<id>
查看监控到的CPU和内存的使用信息
pm2 monitor <AppName>/<id>

Load Balance 4 instances of api.js:
$ pm2 start api.js -i 4

Monitor in production:
$ pm2 monitor

Make pm2 auto-boot at server restart:
$ pm2 startup
```
